#!/usr/bin/env groovy

pipeline {
    agent any

    environment {
        IMAGEM_DOCKER = 'dockerhub.camara.gov.br/copad/sivis2-backend'
        URL_RANCHER = 'https://rancher.camara.gov.br/v2-beta'
        EMAIL_SECAO = 'jairo.rodrigues@camara.leg.br,mario.guedes@camara.leg.br,tiago.andrade@camara.leg.br'
        URL_JENKINS = 'https://jenkins2.camara.gov.br/job/sivis2-backend/'
        APROVADORES = 'p_991310,P_991310,p_6672,P_6672,p_6412,P_6412'
    }

    tools {
        maven 'Maven 3.3.9'
    }

    stages {
        stage('Git checkout') {
            steps {
                checkout scm
                    script {
                        VERSAO_POM = readMavenPom().getVersion()
                        DEPLOY_EM_PRODUCAO = false
                        DEPLOY_APROVACAO_PROD = false
                        DEPLOY_EM_DEV = false
                    }
            }
        }
        stage('Compilação e testes') {
            steps {
                sh "mvn -B -U -e -V clean package"
            }
        }
        stage('Arquivar') {
            steps {
                    archive 'target/sivis2-backend.jar'
                }
        }
        stage('Imagem Docker') {
            steps {
                    echo "Versão do pom.xml: ${VERSAO_POM}"
                    withDockerRegistry([credentialsId: 'c34117dc-5fa1-46f8-8ebb-f1cf0b2254c4', url: 'https://dockerhub.camara.gov.br/']) {
                        script {
                            imagem = docker.build("${env.IMAGEM_DOCKER}:${VERSAO_POM}")
                            imagem.push()
                      }
                }
            }
        }
        stage('Deploy Rancher') {
            environment {
                NOME_SERVICO_TES = 'sivis-tes/sivis2-backend'
                NOME_SERVICO = 'sivis/sivis2-backend'
            }
            steps {
              script {
                 if (VERSAO_POM.endsWith('SNAPSHOT')) {
                    deploy_rancher("cattle", "hmg", "", "${env.IMAGEM_DOCKER}:${VERSAO_POM}", "${env.NOME_SERVICO_TES}", "${VERSAO_POM}", "", "")
                      //echo "Deploy environment Test"
                      //rancher confirm: true, credentialId: 'rancher-server', endpoint: "${env.URL_RANCHER}",
                      //environmentId: '1a408', environments: '', image: "${env.IMAGEM_DOCKER}:${VERSAO_POM}", ports: '',
                      //service: "${env.NOME_SERVICO_TES}", timeout: 100, startFirst: false
                      DEPLOY_EM_DEV = true
                      DEPLOY_APROVACAO_PROD = false
                 } else if (VERSAO_POM.endsWith('HMG')){
                    deploy_rancher("cattle", "hmg", "", "${env.IMAGEM_DOCKER}:${VERSAO_POM}", "${env.NOME_SERVICO}", "${VERSAO_POM}", "", "")
                      //echo "Deploy environment Homologacao"
                      //rancher confirm: true, credentialId: 'rancher-server', endpoint: "${env.URL_RANCHER}",
                      //environmentId: '1a408', environments: '', image: "${env.IMAGEM_DOCKER}:${VERSAO_POM}", ports: '',
                      //service: "${env.NOME_SERVICO}", timeout: 100, startFirst: false
                      DEPLOY_EM_DEV = false
                      DEPLOY_APROVACAO_PROD = false
                  } else {
                      echo "Deploy environment PRODUÇÃO"
                      DEPLOY_APROVACAO_PROD = true
                  }
               }
            }
        }
        stage('Aprovacao de Deploy Producao') {
           when {
               expression {
                   return DEPLOY_APROVACAO_PROD
               }
           }
           steps {
           
               timeout(10) {
                     mail to: "${env.EMAIL_SECAO}",
                     subject: "Aprovação de Deploy em Produção - Job ${env.JOB_NAME}-${env.BUILD_DISPLAY_NAME}",
                     body: """Deploy em produção aguardando aprovação do módulo '${JOB_NAME}' Build (${BUILD_NUMBER}) \nPainel --> ${env.URL_JENKINS} \nAprovação Direta --> ${JENKINS_URL}job/${JOB_NAME}/${BUILD_NUMBER}/input \nMudanças da Versão --> ${currentBuild.absoluteUrl}"""

                    script {
                        aprovador = input message: 'ATENÇÃO! Deseja fazer o deploy em produção?', ok: 'Sim',
                        submitter: "${env.APROVADORES}", submitterParameter: 'aprovador'
                        echo "Deploy em produção aprovado por ${aprovador}"
                        DEPLOY_EM_PRODUCAO = true
                    }
              }
           }
        }
        stage('Deploy Rancher Producao') {
            when {
                expression {
                    return DEPLOY_EM_PRODUCAO
                }
            }
            environment {
                SERVICO_PRODUCAO = 'sivis/sivis2-backend'
            }
            steps {
                scrpit {
                    deploy_rancher("cattle", "prod", "", "${env.IMAGEM_DOCKER}:${VERSAO_POM}", "${env.SERVICO_PRODUCAO}", "${VERSAO_POM}", "", "${aprovador}")
                    //echo "Deploy environment Producao"
                    //rancher confirm: true, credentialId: 'rancher-server', endpoint: "${env.URL_RANCHER}",
                    //environmentId: '1a278', environments: '', image: "${env.IMAGEM_DOCKER}:${VERSAO_POM}", ports: '',
                    //service: "${env.SERVICO_PRODUCAO}", timeout: 100, startFirst: false

                mail to: "${env.EMAIL_SECAO}, sesap.cenin@camara.leg.br",
                     subject: "Deploy em produção rancher - Job ${env.JOB_NAME}-${env.BUILD_DISPLAY_NAME}",
                     body: """Foi feito deploy em Produção da imagem ${env.IMAGEM_DOCKER}, versão ${VERSAO_POM} no serviço ${env.SERVICO_PRODUCAO}.
                     Deploy aprovado por ${aprovador}
                     Url do job: ${currentBuild.absoluteUrl}"""
                }
            }
        }
    }
  }
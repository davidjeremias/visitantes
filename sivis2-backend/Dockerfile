FROM dockerhub.camara.gov.br/infra/openjdk:8u131-jre-alpine-4

LABEL br.leg.camara.secao=COPAD

RUN mkdir -p /app/config
RUN mkdir -p /opt/sivis2
WORKDIR /app

ENV JAVA_OPTS=""

# para fazer debug remoto, adicionar ao JAVA_OPTS o seguinte: -agentlib:jdwp=transport=dt_socket,address=5005,server=y,suspend=n
ENTRYPOINT exec java $JAVA_OPTS -Djava.security.egd=file:/dev/./urandom -jar /app/sivis2-backend.jar

# diretorio onde pode ser incluido application.properties especifico sobrescrevendo propriedades default
VOLUME /app/config
# workdir do tomcat
VOLUME /tmp
VOLUME /opt/sivis2

COPY target/sivis2-backend.jar .

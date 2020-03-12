export function formataFone(fone){

    if(fone != null){
   //retira os caracteres indesejados...
  fone = fone.replace(/[^\d]/g, "");
  //realizar a formatação...
  fone=fone.replace(/^(\d{2})(\d)/g,"($1) $2"); //Coloca parênteses em volta dos dois primeiros dígitos
  fone=fone.replace(/(\d)(\d{4})$/,"$1-$2");    //Coloca hífen entre o quarto e o quinto dígitos
  fone.replace(/(\d)(\d{4})$/,"$1-$2");
  }else{
    return null;
  }
  return fone;
}

export function formatarData(dataSemFormato) {
      
  var data = moment(dataSemFormato, 'YYYY-MM-DD');
  return moment(data).format('DD/MM/YYYY');
}


export function formataCPF(cpf) {
  //retira os caracteres indesejados...
  cpf = cpf.replace(/[^\d]/g, "");
  //realizar a formatação...
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}


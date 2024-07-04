const Functions = {
    validarCnpj,
    formatNumberToData,
    formatCnpj,
    formatNumberToCurrency,
    formatCep,
    formatPhone
};

function validarCnpj(cnpj) {
    cnpj = cnpj.replace(/[^\d]+/g,'');
  
    if(cnpj == '') return false;
     
    if (cnpj.length != 14)
        return false;
  
    if (cnpj == "00000000000000" || 
        cnpj == "11111111111111" || 
        cnpj == "22222222222222" || 
        cnpj == "33333333333333" || 
        cnpj == "44444444444444" || 
        cnpj == "55555555555555" || 
        cnpj == "66666666666666" || 
        cnpj == "77777777777777" || 
        cnpj == "88888888888888" || 
        cnpj == "99999999999999")
        return false;
         
    let tamanho = cnpj.length - 2
    let numeros = cnpj.substring(0,tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
      soma += Number(numeros.charAt(tamanho - i)) * pos--;
      if (pos < 2) {
        pos = 9;
      }
    }

    let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != Number(digitos.charAt(0))) {
        return false;
    }
         
    tamanho = tamanho + 1;
    numeros = cnpj.substring(0,tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
      soma += Number(numeros.charAt(tamanho - i)) * pos--;
      if (pos < 2) {
        pos = 9;
      }
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != Number(digitos.charAt(1))) {
        return false;
    }
          
    return true;
}

function formatNumberToData(num) {
  if(num) {
    let numString = num.toString()
    let ano = numString.slice(0, 4)
    let mes = numString.slice(4, 6)
    let dia = numString.slice(6, 8)
  
    return dia + '/' + mes + '/' + ano
  } else {
    return num
  }
}

function formatCnpj(cnpj) {
    if(cnpj) {
      return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")
    } else {
      return cnpj
    }
}

function formatNumberToCurrency(value) {
  let moneyString = value.toString()
  let moneyArray = moneyString.split('.')
  let reais = moneyArray[0]
  let cents = '00'

  if(moneyArray[1]) {
    if(moneyArray[1].length == 1) {
      cents = moneyArray[1] + '0'
    } else {
      cents = moneyArray[1]
    }
  } 

  return 'R$ ' + reais + ',' + cents
}

function formatCep(cep) {
  let first = cep.slice(0, 5)
  let second = cep.slice(5)

  return first + '-' + second
}

function formatPhone(ddd, phone) {
  let first = phone.slice(0, 4)
  let second = phone.slice(4)

  return '(' + ddd + ') ' + first + '-' + second
}

export default Functions;

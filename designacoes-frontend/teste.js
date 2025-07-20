function criaPessoa(nome, idade) { // função que cria um objeto pessoa
    return {nome, idade}
}
const pessoa1 = criaPessoa('William', 49);
console.log(pessoa1);

const pessoa2 = (nome, idade) => {
    return {nome, idade}
}
// O carrinho guarda uma entrada por unidade adicionada.
// Ex.: duas camisetas iguais = o mesmo produto duas vezes no array.

export function parsearPreco(valor) {
  if (valor === null || valor === undefined || String(valor).trim() === '') return Number.NaN

  const texto = String(valor).trim()

  if (texto.includes(',') && texto.includes('.')) {
    return Number(texto.replace(/\./g, '').replace(',', '.'))
  }

  if (texto.includes(',')) {
    return Number(texto.replace(',', '.'))
  }

  return Number(texto)
}

export function normalizarPreco(valor) {
  const numero = parsearPreco(valor)
  return Number.isFinite(numero) ? numero : 0
}

export function produtoComPrecoValido(produto) {
  if (!produto) return false

  const valor = produto.price
  if (valor === null || valor === undefined || String(valor).trim() === '') return false

  const numero = parsearPreco(valor)
  return Number.isFinite(numero)
}

export function calcularTotal(carrinho) {
  const total = carrinho.reduce((acumulado, produto) => acumulado + normalizarPreco(produto.price), 0)
  return Number(total.toFixed(2))
}

export function agruparItens(carrinho) {
  const itens = []
  carrinho.forEach((produto) => {
    const existente = itens.find((item) => item.produto.id === produto.id)
    if (existente) {
      existente.quantidade += 1
    } else {
      itens.push({ produto, quantidade: 1 })
    }
  })
  return itens
}

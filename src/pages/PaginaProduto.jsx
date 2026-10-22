import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import ProdutoCard from '../components/ProdutoCard'
import { formatarPreco } from '../utils/formatarPreco'
import { produtoComPrecoValido } from '../utils/carrinho'

export default function PaginaProduto({ produtos, clienteAtual, onAdicionar, onRegistrarListaEspera }) {
  const { id } = useParams()
  const produto = produtos.find((item) => item.id === id)
  const produtoDisponivel = produtoComPrecoValido(produto)
  const esgotado = produto?.estoque === 0
  const [nome, setNome] = useState(clienteAtual?.nome ?? '')
  const [email, setEmail] = useState(clienteAtual?.email ?? '')
  const [mensagemListaEspera, setMensagemListaEspera] = useState('')

  useEffect(() => {
    if (clienteAtual) {
      setNome(clienteAtual.nome)
      setEmail(clienteAtual.email)
    }
  }, [clienteAtual])

  function enviarListaEspera(evento) {
    evento.preventDefault()

    const nomeFormatado = nome.trim()
    const emailFormatado = email.trim()

    if (!nomeFormatado || !emailFormatado) {
      setMensagemListaEspera('Preencha seu nome e e-mail para receber o aviso.')
      return
    }

    const sucesso = onRegistrarListaEspera({
      produtoId: produto.id,
      nome: nomeFormatado,
      email: emailFormatado,
    })

    if (sucesso) {
      setMensagemListaEspera('Você entrou na lista de espera para este produto.')
      setNome('')
      setEmail('')
    } else {
      setMensagemListaEspera('Você já está na lista de espera deste produto.')
    }
  }

  if (!produto) {
    return (
      <div className="estado-vazio">
        <p>Produto não encontrado.</p>
        <Link to="/" className="botao botao-secundario">
          Voltar para a loja
        </Link>
      </div>
    )
  }

  const relacionados = produtos
    .filter(
      (item) =>
        item.category === produto.category &&
        item.id !== produto.id &&
        produtoComPrecoValido(item) &&
        item.estoque > 0
    )
    .slice(0, 4)

  return (
    <section>
      <nav className="trilha" aria-label="Você está em">
        <Link to="/">Loja</Link>
        <span aria-hidden="true">/</span>
        <span>{produto.title}</span>
      </nav>

      <div className="detalhe">
        <div className="detalhe-imagem-moldura">
          <img src={produto.image} alt={produto.title} className="detalhe-imagem" />
        </div>

        <div className="detalhe-info">
          <h1>{produto.title}</h1>
          <p className="card-avaliacao">
            ★ {produto.rating.rate} <span>({produto.rating.count} avaliações)</span>
          </p>
          <p className="detalhe-preco">
            {produtoDisponivel ? formatarPreco(produto.price) : 'Preço indisponível'}
          </p>
          <p className="detalhe-descricao">{produto.description}</p>
          <p className="detalhe-estoque">{produto.estoque} unidades disponíveis</p>

          {!esgotado && (
            <button
              className="botao botao-grande"
              onClick={() => onAdicionar(produto)}
              disabled={!produtoDisponivel}
            >
              {produtoDisponivel ? 'Adicionar ao carrinho' : 'Produto indisponível'}
            </button>
          )}

          {esgotado && (
            <form className="cupom" onSubmit={enviarListaEspera}>
              <label htmlFor="nome-espera" className="rotulo">
                Receber aviso quando voltar
              </label>
              <input
                id="nome-espera"
                value={nome}
                onChange={(evento) => setNome(evento.target.value)}
                placeholder="Seu nome"
              />
              <input
                type="email"
                value={email}
                onChange={(evento) => setEmail(evento.target.value)}
                placeholder="Seu e-mail"
              />
              <button type="submit" className="botao botao-secundario">
                Avise-me
              </button>
              {mensagemListaEspera && <p className="mensagem-cupom">{mensagemListaEspera}</p>}
            </form>
          )}

          <ul className="detalhe-garantias">
            <li>Troca grátis em até 30 dias</li>
            <li>Parcele em até 10x sem juros</li>
          </ul>
        </div>
      </div>

      <h2>Produtos relacionados</h2>
      <div className="grade">
        {relacionados.map((item) => (
          <ProdutoCard key={item.id} produto={item} onAdicionar={onAdicionar} />
        ))}
      </div>
    </section>
  )
}

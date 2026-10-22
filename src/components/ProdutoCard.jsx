import { Link } from 'react-router'
import { formatarPreco } from '../utils/formatarPreco'
import { produtoComPrecoValido } from '../utils/carrinho'

export default function ProdutoCard({ produto, onAdicionar }) {
  const esgotado = produto.estoque === 0
  const precoValido = produtoComPrecoValido(produto)

  return (
    <article className="card">
      <Link to={`/produto/${produto.id}`} className="card-link">
        <div className="card-imagem-moldura">
          <img src={produto.image} alt={produto.title} className="card-imagem" />
        </div>
        <h3 className="card-titulo">{produto.title}</h3>
      </Link>

      <p className="card-avaliacao">
        ★ {produto.rating.rate} <span>({produto.rating.count} avaliações)</span>
      </p>

      <div className="card-precos">
        {produto.precoOriginal && (
          <span className="preco-original">{formatarPreco(produto.precoOriginal)}</span>
        )}
        <span className="preco">
          {precoValido ? formatarPreco(produto.price) : 'Preço indisponível'}
        </span>
      </div>

      <div className="card-selos">
        {precoValido && Number(produto.price) >= 200 && (
          <span className="selo selo-frete">Frete grátis</span>
        )}
        {esgotado && <span className="selo selo-esgotado">Esgotado</span>}
      </div>

      <button className="botao" onClick={() => onAdicionar(produto)} disabled={esgotado || !precoValido}>
        {precoValido ? 'Adicionar ao carrinho' : 'Indisponível'}
      </button>
    </article>
  )
}

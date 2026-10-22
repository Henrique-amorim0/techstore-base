import ProdutoCard from './ProdutoCard'

export default function SugestaoItem({ produto, onAdicionar }) {
  return <ProdutoCard produto={produto} onAdicionar={onAdicionar} />
}

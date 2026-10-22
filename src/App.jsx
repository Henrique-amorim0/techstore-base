import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router'
import Header from './components/Header'
import Footer from './components/Footer'
import RolarParaTopo from './components/RolarParaTopo'
import Loja from './pages/Loja'
import PaginaProduto from './pages/PaginaProduto'
import Carrinho from './pages/Carrinho'
import Estoque from './pages/Estoque'
import { buscarProdutos } from './services/produtos'
import { buscarClientes } from './services/clientes'
import { produtoComPrecoValido } from './utils/carrinho'

export default function App() {
  const [produtos, setProdutos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)
  const [carrinho, setCarrinho] = useState([])
  const [clientes, setClientes] = useState([])
  const [clienteAtualId, setClienteAtualId] = useState(null)
  const [listaEspera, setListaEspera] = useState([])

  useEffect(() => {
    buscarProdutos()
      .then((dados) => setProdutos(dados))
      .catch(() => setErro('Não foi possível carregar os produtos.'))
      .finally(() => setCarregando(false))

    buscarClientes().then((dados) => {
      setClientes(dados)
      if (dados.length > 0) setClienteAtualId(dados[0].id)
    })
  }, [])

  function adicionarAoCarrinho(produto) {
    if (!produtoComPrecoValido(produto) || produto.estoque === 0) return

    setCarrinho((carrinhoAtual) => carrinhoAtual.concat(produto))
  }

  function registrarInteresse({ produtoId, nome, email }) {
    if (!produtoId || !nome || !email) return false

    setListaEspera((interessadosAtuais) => {
      const jaCadastrado = interessadosAtuais.some(
        (interesse) =>
          interesse.produtoId === produtoId &&
          interesse.email.toLowerCase() === email.trim().toLowerCase()
      )

      if (jaCadastrado) return interessadosAtuais

      return [
        ...interessadosAtuais,
        {
          produtoId,
          nome: nome.trim(),
          email: email.trim().toLowerCase(),
        },
      ]
    })

    return true
  }

  function removerUmaUnidade(produtoId) {
    setCarrinho((carrinhoAtual) => {
      const indicePrimeiro = carrinhoAtual.findIndex((produto) => produto.id === produtoId)

      if (indicePrimeiro === -1) return carrinhoAtual

      return carrinhoAtual.filter((produto, indice) => indice !== indicePrimeiro)
    })
  }

  function removerTodosDoProduto(produtoId) {
    setCarrinho((carrinhoAtual) => carrinhoAtual.filter((produto) => produto.id !== produtoId))
  }

  const clienteAtual = clientes.find((cliente) => cliente.id === clienteAtualId)

  return (
    <div className="app">
      <RolarParaTopo />
      <Header carrinho={carrinho} clienteAtual={clienteAtual} />

      <main className="conteudo">
        {carregando && <p className="aviso">Carregando produtos...</p>}
        {erro && <p className="aviso aviso-erro">{erro}</p>}

        {!carregando && !erro && (
          <Routes>
            <Route
              path="/"
              element={<Loja produtos={produtos} onAdicionar={adicionarAoCarrinho} />}
            />
            <Route
              path="/produto/:id"
              element={
                <PaginaProduto
                  produtos={produtos}
                  clienteAtual={clienteAtual}
                  onAdicionar={adicionarAoCarrinho}
                  onRegistrarListaEspera={registrarInteresse}
                />
              }
            />
            <Route
              path="/carrinho"
              element={
                <Carrinho
                  carrinho={carrinho}
                  produtos={produtos}
                  clienteAtual={clienteAtual}
                  onAdicionar={adicionarAoCarrinho}
                  onRemover={removerUmaUnidade}
                  onRemoverTodos={removerTodosDoProduto}
                />
              }
            />
            <Route path="/estoque" element={<Estoque produtos={produtos} listaEspera={listaEspera} />} />
          </Routes>
        )}
      </main>

      <Footer
        clientes={clientes}
        clienteAtualId={clienteAtualId}
        onTrocarCliente={setClienteAtualId}
      />
    </div>
  )
}

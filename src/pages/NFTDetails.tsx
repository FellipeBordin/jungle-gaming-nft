
import { Link, useParams } from '@tanstack/react-router'

import { Header } from '../components/Header'
import { nftFixtures } from '../mocks/fixtures'
import { useCart } from '../contexts/CartContext'

export function NFTDetails() {
  const { nftId } = useParams({
    from: '/nft/$nftId',
  })

  const { addItem, items } = useCart()

  // Busca o NFT pelo ID recebido na URL
  const nft = nftFixtures.find(
    (item) => item.id === nftId
  )

  // Verifica quantas unidades deste NFT estão no carrinho
  const quantityInCart =
    items.find((item) => item.nft.id === nftId)?.quantity ?? 0

  // NFT NÃO ENCONTRADO
  if (!nft) {
    return (
      <div className="min-h-screen bg-[#120D0B] text-white">
        <Header />

        <main className="mx-auto max-w-5xl px-6 py-20 text-center">
          <h1 className="text-3xl font-bold">
            NFT não encontrado
          </h1>

          <p className="mt-4 text-gray-400">
            O NFT solicitado não existe ou não está disponível.
          </p>

          <Link
            to="/"
            search={{
              search: '',
              page: 1,
              network: 'all',
              sort: 'newest',
            }}
            className="mt-6 inline-block rounded-lg bg-[#D9944E] px-6 py-3 font-semibold text-[#120D0B]"
          >
            Voltar ao marketplace
          </Link>
        </main>
      </div>
    )
  }

  // Verifica se ainda podemos adicionar unidades
  const stockLimitReached =
    quantityInCart >= nft.available

  return (
    <div className="min-h-screen bg-[#120D0B] text-white">
      <Header />

      <main className="mx-auto max-w-6xl px-6 py-12">

        {/* VOLTAR AO MARKETPLACE */}
        <Link
          to="/"
          search={{
            search: '',
            page: 1,
            network: 'all',
            sort: 'newest',
          }}
          className="text-sm text-[#D9944E] hover:underline"
        >
          ← Voltar ao marketplace
        </Link>

        {/* CONTEÚDO PRINCIPAL */}
        <div className="mt-10 grid gap-10 md:grid-cols-2">

          {/* IMAGEM DO NFT */}
          <div className="overflow-hidden rounded-2xl border border-[#38251C] bg-[#211712]">
            <img
              src={nft.imageUrl}
              alt={`Arte digital ${nft.name}`}
              className="aspect-square w-full object-cover"
            />
          </div>

          {/* INFORMAÇÕES DO NFT */}
          <div>
            <p className="text-sm uppercase tracking-widest text-[#D9944E]">
              {nft.collection}
            </p>

            <h1 className="mt-3 text-4xl font-bold">
              {nft.name}
            </h1>

            <p className="mt-5 text-gray-400">
              Explore esta obra digital exclusiva
              disponível no marketplace Kurio.
            </p>

            {/* PREÇO E DISPONIBILIDADE */}
            <div className="mt-8 rounded-xl border border-[#38251C] bg-[#211712] p-6">

              <p className="text-sm text-gray-400">
                Preço atual
              </p>

              <p className="mt-2 text-3xl font-bold text-[#D9944E]">
                {nft.priceEth} ETH
              </p>

              {/* REDE */}
              <div className="mt-6 flex justify-between border-t border-[#38251C] pt-5">
                <span className="text-gray-400">
                  Rede
                </span>

                <span className="capitalize">
                  {nft.network}
                </span>
              </div>

              {/* ESTOQUE */}
              <div className="mt-4 flex justify-between">
                <span className="text-gray-400">
                  Disponíveis
                </span>

                <span>{nft.available}</span>
              </div>

              {/* QUANTIDADE NO CARRINHO */}
              <div className="mt-4 flex justify-between">
                <span className="text-gray-400">
                  No seu carrinho
                </span>

                <span className="font-semibold text-[#D9944E]">
                  {quantityInCart}
                </span>
              </div>

              {/* BOTÃO ADICIONAR */}
              <button
                type="button"
                disabled={stockLimitReached}
                onClick={() => addItem(nft)}
                className="mt-8 w-full rounded-lg bg-[#D9944E] px-6 py-4 font-bold text-[#120D0B] transition hover:bg-[#E9A963] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {stockLimitReached
                  ? 'Limite disponível atingido'
                  : 'Adicionar ao carrinho'}
              </button>

              {/* MENSAGEM DE CONFIRMAÇÃO */}
              {quantityInCart > 0 && (
                <p
                  role="status"
                  className="mt-4 text-center text-sm text-green-400"
                >
                  {quantityInCart}{' '}
                  {quantityInCart === 1
                    ? 'unidade adicionada ao carrinho'
                    : 'unidades adicionadas ao carrinho'}
                </p>
              )}


{quantityInCart > 0 && (
  <Link
    to="/cart"
    className="mt-4 block rounded-lg border border-[#D9944E] px-6 py-3 text-center font-semibold text-[#D9944E] transition hover:bg-[#38251C]"
  >
    Ver meu carrinho
  </Link>
)}


              {/* INFORMAÇÃO SOBRE ESTOQUE */}
              {stockLimitReached && (
                <p className="mt-3 text-center text-sm text-gray-400">
                  Você atingiu a quantidade máxima disponível
                  deste NFT.
                </p>
              )}
            </div>

            {/* INFORMAÇÕES ADICIONAIS */}
            <div className="mt-6 rounded-xl border border-[#38251C] bg-[#211712] p-6">
              <h2 className="text-lg font-semibold">
                Detalhes da coleção
              </h2>

              <div className="mt-4 flex justify-between">
                <span className="text-gray-400">
                  Identificador
                </span>

                <span>#{nft.id}</span>
              </div>

              <div className="mt-4 flex justify-between">
                <span className="text-gray-400">
                  Coleção
                </span>

                <span>{nft.collection}</span>
              </div>

              <div className="mt-4 flex justify-between">
                <span className="text-gray-400">
                  Blockchain
                </span>

                <span className="capitalize">
                  {nft.network}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

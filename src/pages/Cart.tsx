
import { Link } from '@tanstack/react-router'

import { Header } from '../components/Header'
import { useCart } from '../contexts/CartContext'

export function Cart() {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    totalEth,
  } = useCart()

  return (
    <div className="min-h-screen bg-[#120D0B] text-white">
      <Header />

      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
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
          ← Continuar explorando
        </Link>

        <h1 className="mt-8 text-3xl font-bold">
          Meu carrinho
        </h1>

        <p className="mt-2 text-gray-400">
          {totalItems}{' '}
          {totalItems === 1
            ? 'item no carrinho'
            : 'itens no carrinho'}
        </p>

        {items.length === 0 ? (
          <div className="mt-10 rounded-xl border border-[#38251C] bg-[#211712] p-10 text-center">
            <h2 className="text-xl font-semibold">
              Seu carrinho está vazio
            </h2>

            <p className="mt-3 text-gray-400">
              Explore o marketplace e adicione seus NFTs favoritos.
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
              Explorar NFTs
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">

            {/* ITENS DO CARRINHO */}
            <section
              aria-label="Itens do carrinho"
              className="space-y-4"
            >
              {items.map(({ nft, quantity }) => (
                <article
                  key={nft.id}
                  className="flex flex-col gap-5 rounded-xl border border-[#38251C] bg-[#211712] p-4 sm:flex-row"
                >
                  <img
                    src={nft.imageUrl}
                    alt={nft.name}
                    className="aspect-square w-full rounded-lg object-cover sm:h-32 sm:w-32"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-400">
                      {nft.collection}
                    </p>

                    <Link
                      to="/nft/$nftId"
                      params={{ nftId: nft.id }}
                      className="mt-1 block text-xl font-semibold hover:text-[#D9944E]"
                    >
                      {nft.name}
                    </Link>

                    <p className="mt-3 font-bold text-[#D9944E]">
                      {nft.priceEth} ETH
                    </p>

                    {/* CONTROLE DE QUANTIDADE */}
                    <div className="mt-4 flex items-center gap-3">
                      <button
                        type="button"
                        aria-label={`Diminuir quantidade de ${nft.name}`}
                        onClick={() =>
                          updateQuantity(nft.id, quantity - 1)
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#38251C] text-lg hover:border-[#D9944E]"
                      >
                        −
                      </button>

                      <span className="min-w-6 text-center font-semibold">
                        {quantity}
                      </span>

                      <button
                        type="button"
                        aria-label={`Aumentar quantidade de ${nft.name}`}
                        disabled={quantity >= nft.available}
                        onClick={() =>
                          updateQuantity(nft.id, quantity + 1)
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#38251C] text-lg hover:border-[#D9944E] disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        +
                      </button>

                      <span className="text-xs text-gray-400">
                        Máx. {nft.available}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(nft.id)}
                      className="mt-4 text-sm text-red-400 hover:underline"
                    >
                      Remover item
                    </button>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="text-xs text-gray-400">
                      Subtotal
                    </p>

                    <p className="mt-1 font-bold text-[#D9944E]">
                      {(
                        (Math.round(Number(nft.priceEth) * 100) *
                          quantity) /
                        100
                      ).toFixed(2)}{' '}
                      ETH
                    </p>
                  </div>
                </article>
              ))}
            </section>

            {/* RESUMO DO PEDIDO */}
            <aside className="rounded-xl border border-[#38251C] bg-[#211712] p-6">
              <h2 className="text-xl font-bold">
                Resumo do pedido
              </h2>

              <div className="mt-6 flex justify-between text-gray-400">
                <span>Itens</span>
                <span>{totalItems}</span>
              </div>

              <div className="mt-5 flex justify-between border-t border-[#38251C] pt-5">
                <span className="font-semibold">
                  Total
                </span>

                <span className="text-xl font-bold text-[#D9944E]">
                  {totalEth} ETH
                </span>
              </div>

              <Link
                to="/checkout"
                className="mt-6 block w-full rounded-lg bg-[#D9944E] px-6 py-4 text-center font-bold text-[#120D0B] transition hover:bg-[#E9A963]"
              >
                Finalizar compra
              </Link>

              <button
                type="button"
                onClick={clearCart}
                className="mt-4 w-full rounded-lg border border-[#38251C] px-4 py-3 text-gray-300 hover:border-red-400 hover:text-red-400"
              >
                Esvaziar carrinho
              </button>
            </aside>
          </div>
        )}
      </main>
    </div>
  )
}

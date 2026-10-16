
import { useOrders } from '../hooks/useOrders'
import { nftFixtures } from '../mocks/fixtures'

interface OrderHistoryProps {
  email: string
}

export function OrderHistory({ email }: OrderHistoryProps) {
  const {
    data: orders,
    isPending,
    isError,
    refetch,
  } = useOrders(email)

  if (isPending) {
    return (
      <p className="mt-5 text-gray-400">
        Carregando histórico de compras...
      </p>
    )
  }

  if (isError) {
    return (
      <div className="mt-5">
        <p className="text-red-400">
          Não foi possível carregar seus pedidos.
        </p>

        <button
          type="button"
          onClick={() => void refetch()}
          className="mt-4 rounded-lg bg-[#D9944E] px-5 py-2 font-semibold text-[#120D0B]"
        >
          Tentar novamente
        </button>
      </div>
    )
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="mt-5 rounded-xl border border-[#38251C] bg-[#120D0B] p-6">
        <p className="text-gray-400">
          Você ainda não realizou nenhuma compra.
        </p>
      </div>
    )
  }

  return (
    <div className="mt-6 space-y-5">
      {orders.map((order) => (
        <article
          key={order.id}
          className="rounded-xl border border-[#38251C] bg-[#120D0B] p-5"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-400">
                Número do pedido
              </p>

              <h3 className="mt-1 break-all font-semibold text-[#D9944E]">
                {order.id}
              </h3>

              <p className="mt-2 text-sm text-gray-400">
                {new Date(order.createdAt).toLocaleString(
                  'pt-BR',
                )}
              </p>
            </div>

            <span className="rounded-full border border-green-800 bg-green-950 px-3 py-1 text-xs font-medium text-green-400">
              Confirmado
            </span>
          </div>

          <div className="mt-5 space-y-4 border-t border-[#38251C] pt-5">
            {order.items.map((item) => {
              const nft = nftFixtures.find(
                (entry) => entry.id === item.nftId,
              )

              const itemTotal = nft
                ? Number(nft.priceEth) * item.quantity
                : null

              return (
                <div
                  key={item.nftId}
                  className="flex items-center gap-4"
                >
                  {nft && (
                    <img
                      src={nft.imageUrl}
                      alt={nft.name}
                      className="h-16 w-16 rounded-lg object-cover"
                    />
                  )}

                  <div className="min-w-0 flex-1">
                    <p className="font-medium">
                      {nft?.name ?? item.nftId}
                    </p>

                    <p className="mt-1 text-sm text-gray-400">
                      Quantidade: {item.quantity}
                    </p>
                  </div>

                  {itemTotal !== null && (
                    <p className="text-sm font-semibold text-[#D9944E]">
                      {itemTotal.toFixed(3)} ETH
                    </p>
                  )}
                </div>
              )
            })}
          </div>

          <div className="mt-5 flex justify-between border-t border-[#38251C] pt-4">
            <span className="font-semibold">
              Total do pedido
            </span>

            <span className="font-bold text-[#D9944E]">
              {order.items
                .reduce((total, item) => {
                  const nft = nftFixtures.find(
                    (entry) => entry.id === item.nftId,
                  )

                  return (
                    total +
                    (nft ? Number(nft.priceEth) : 0) *
                      item.quantity
                  )
                }, 0)
                .toFixed(3)}{' '}
              ETH
            </span>
          </div>
        </article>
      ))}
    </div>
  )
}

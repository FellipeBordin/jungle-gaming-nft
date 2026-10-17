import { X, Check, ShoppingBag } from "lucide-react";
import type { NFT } from "../types/nft";

export type ConfirmedOrder = {
  id: string;
  date: Date;
  walletName: string;
  totalEth: string;
  items: {
    nft: NFT;
    quantity: number;
  }[];
};

type Props = {
  order: ConfirmedOrder;
  onClose: () => void;
};

const eth = (value: number) => `${value.toFixed(2)} ETH`;

export function OrderConfirmationModal({ order, onClose }: Props) {
  const networkFee = 0.016;

  const totalWithFee = (Number(order.totalEth) + networkFee).toFixed(3);

  const date = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(order.date);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/80 px-3 py-5 text-[#F5EAE0] sm:px-6"
      role="presentation"
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirmation-title"
        className="relative my-auto w-full max-w-[570px] overflow-hidden rounded-sm border border-[#5D3928] bg-[#241612] shadow-[0_24px_90px_rgba(0,0,0,0.6)]"
      >
        {/* Fechar modal */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar confirmação"
          className="absolute right-4 top-4 z-10 rounded-full p-2 text-[#D9944E] transition hover:bg-[#40271F]"
        >
          <X size={19} />
        </button>

        {/* Cabeçalho */}
        <header className="border-b border-[#B5743E] px-5 pb-5 pt-8 text-center sm:px-8">
          <div className="mx-auto flex h-[70px] w-[70px] flex-col items-center justify-center rounded-xl border-2 border-[#D9944E] text-[#D9944E]">
            <Check size={24} strokeWidth={2.5} />

            <span className="text-[10px] font-black uppercase leading-tight">
              Thank
            </span>

            <span className="text-[10px] font-black uppercase leading-tight">
              You
            </span>
          </div>

          <h1
            id="confirmation-title"
            className="mt-5 text-lg font-bold sm:text-xl"
          >
            Pedido confirmado!
          </h1>

          <p className="mt-2 text-xs text-[#D0AD94]">
            Seus NFTs foram registrados no pedido demonstrativo.
          </p>
        </header>

        {/* Informações do pedido */}
        <div className="grid grid-cols-2 gap-y-4 border-b border-[#B5743E] px-5 py-4 text-xs sm:grid-cols-4 sm:px-8">
          <div className="min-w-0 pr-2 sm:border-r sm:border-[#8A5837]">
            <p className="text-[#C8AB97]">ID do pedido</p>

            <p className="mt-1 break-all font-semibold">{order.id}</p>
          </div>

          <div className="min-w-0 sm:border-r sm:border-[#8A5837] sm:px-3">
            <p className="text-[#C8AB97]">Data</p>

            <p className="mt-1 font-semibold">{date}</p>
          </div>

          <div className="min-w-0 pr-2 sm:border-r sm:border-[#8A5837] sm:px-3">
            <p className="text-[#C8AB97]">Total estimado</p>

            <p className="mt-1 font-semibold text-[#E9A253]">
              {totalWithFee} ETH
            </p>
          </div>

          <div className="min-w-0 sm:pl-3">
            <p className="text-[#C8AB97]">Carteira escolhida</p>

            <p className="mt-1 break-words font-semibold">{order.walletName}</p>
          </div>
        </div>

        {/* Detalhes do pedido */}
        <div className="px-5 pb-8 pt-5 sm:px-8">
          <h2 className="mb-4 text-sm font-bold">Detalhes do pedido</h2>

          <div className="grid grid-cols-[minmax(0,1fr)_55px_95px] gap-2 border-b border-[#64412F] pb-2 text-[11px] font-semibold sm:grid-cols-[minmax(0,1fr)_80px_110px]">
            <span>NFTs</span>

            <span className="text-center">Edições</span>

            <span className="text-right">Subtotal</span>
          </div>

          {/* NFTs comprados */}
          <div className="mt-3 space-y-3">
            {order.items.map(({ nft, quantity }) => (
              <div
                key={nft.id}
                className="grid grid-cols-[minmax(0,1fr)_55px_95px] items-center gap-2 sm:grid-cols-[minmax(0,1fr)_80px_110px]"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <img
                    src={nft.imageUrl}
                    alt={nft.name}
                    className="h-14 w-14 shrink-0 rounded-md object-cover"
                  />

                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold sm:text-sm">
                      {nft.name}
                    </p>

                    <p className="mt-1 text-[10px] text-[#BE9068]">
                      ID do token: #{nft.id.padStart(4, "0")}
                    </p>
                  </div>
                </div>

                <span className="text-center text-xs text-[#D6B99F]">
                  (× {quantity})
                </span>

                <span className="text-right text-xs font-bold text-[#E9A253] sm:text-sm">
                  {eth(Number(nft.priceEth) * quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Valores */}
          <div className="mt-6 space-y-2 border-b border-[#64412F] pb-4 text-xs">
            <div className="flex justify-between gap-3">
              <span className="text-[#C8AB97]">Subtotal dos NFTs</span>

              <span>{order.totalEth} ETH</span>
            </div>

            <div className="flex justify-between gap-3">
              <span className="text-[#C8AB97]">
                Taxa de rede (demonstrativa)
              </span>

              <span className="text-[#F3EAE2]">
                {networkFee.toFixed(3)} ETH
              </span>
            </div>

            <div className="flex justify-between gap-3 pt-2 text-sm font-bold">
              <span>Total estimado</span>

              <span className="text-[#E9A253]">{totalWithFee} ETH</span>
            </div>
          </div>

          {/* Confirmação */}
          <div className="mt-4 text-center">
            <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-[#3E2A20] text-[#E9A253]">
              <ShoppingBag size={18} />
            </div>

            <p className="mx-auto mt-3 max-w-[390px] text-xs leading-5 text-[#C9AA93]">
              Pedido registrado com sucesso no ambiente de demonstração. Nenhuma
              transferência de NFT ou criptomoeda foi realizada na blockchain.
            </p>

            <p className="mx-auto mt-2 max-w-[390px] text-[10px] leading-4 text-[#A98A73]">
              A taxa de rede exibida é apenas uma estimativa ilustrativa e não
              foi cobrada ou registrada no pedido.
            </p>

            <button
              type="button"
              onClick={onClose}
              className="mt-5 rounded-md bg-[#D9944E] px-7 py-3 text-xs font-bold text-[#21140E] transition hover:bg-[#EBAE6A]"
            >
              Voltar ao marketplace
            </button>
          </div>
        </div>

        {/* Barra inferior */}
        <div className="h-2 bg-[#D9944E]" />
      </section>
    </div>
  );
}

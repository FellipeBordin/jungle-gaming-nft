import { api } from "../services/api";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingCart,
  Trash2,
} from "lucide-react";

import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { useCart } from "../hooks/useCart";
import type { NFT, NFTListResponse } from "../types/nft";

function formatEth(value: number | string) {
  return `${Number(value).toFixed(2)} ETH`;
}

async function fetchRecommendedNFTs(): Promise<NFT[]> {
  const { data } = await api.get<NFTListResponse>("/nfts?page=1");

  return data.items;
}

function RecommendedNFTs({ cartIds }: { cartIds: string[] }) {
  const [page, setPage] = useState(0);

  const {
    data = [],
    isPending,
    isError,
  } = useQuery({
    queryKey: ["cart-recommended-nfts"],
    queryFn: fetchRecommendedNFTs,
  });

  const outsideCart = data.filter((nft) => !cartIds.includes(nft.id));

  // Prioriza NFTs fora do carrinho, mas mantém os demais
  // como opções para completar a seção visual do Figma.
  const recommended = [
    ...outsideCart,
    ...data.filter((nft) => cartIds.includes(nft.id)),
  ];

  const pageSize = 5;
  const totalPages = Math.max(1, Math.ceil(recommended.length / pageSize));
  const currentPage = Math.min(page, totalPages - 1);

  const visible = recommended.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize,
  );

  return (
    <section className="mt-20 hidden md:block">
      <div className="flex items-center justify-between border-b border-[#64432D] pb-3">
        <h2 className="text-sm font-bold text-[#E3A04F]">
          Colecionadores também viram
        </h2>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPage((current) => Math.max(0, current - 1))}
            disabled={currentPage === 0}
            aria-label="Recomendações anteriores"
            className="rounded-full border border-[#62432F] p-1.5 text-[#D9944E] disabled:opacity-30"
          >
            <ChevronLeft size={15} />
          </button>

          <button
            type="button"
            onClick={() =>
              setPage((current) => Math.min(totalPages - 1, current + 1))
            }
            disabled={currentPage >= totalPages - 1}
            aria-label="Próximas recomendações"
            className="rounded-full border border-[#62432F] p-1.5 text-[#D9944E] disabled:opacity-30"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      {isPending && (
        <div className="mt-5 grid grid-cols-5 gap-4">
          {Array.from({ length: 5 }, (_, index) => (
            <div
              key={index}
              className="aspect-square animate-pulse rounded-lg bg-[#302019]"
            />
          ))}
        </div>
      )}

      {isError && (
        <p className="mt-5 text-xs text-[#BFA28D]">
          Não foi possível carregar as recomendações.
        </p>
      )}

      {!isPending && !isError && (
        <>
          <div className="mt-5 grid grid-cols-5 gap-4">
            {visible.map((nft) => (
              <Link
                key={nft.id}
                to="/nft/$nftId"
                params={{ nftId: nft.id }}
                className="group min-w-0"
              >
                <div className="aspect-square overflow-hidden rounded-lg bg-[#302019] p-1.5">
                  <img
                    src={nft.imageUrl}
                    alt={nft.name}
                    className="h-full w-full rounded-md object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                <p className="mt-2 truncate text-xs font-semibold">
                  {nft.name}
                </p>

                <p className="mt-1 text-xs font-bold text-[#D9944E]">
                  {formatEth(nft.priceEth)}
                </p>
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex justify-center gap-2">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setPage(index)}
                  aria-label={`Página ${index + 1}`}
                  aria-pressed={currentPage === index}
                  className={`h-2.5 w-2.5 rounded-full ${
                    currentPage === index
                      ? "bg-[#D9944E]"
                      : "border border-[#D9944E]"
                  }`}
                />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}

export function Cart() {
  const { items, removeItem, updateQuantity, clearCart, totalItems, totalEth } =
    useCart();

  const [coupon, setCoupon] = useState("");
  const [couponMessage, setCouponMessage] = useState("");

  const subtotal = Number(totalEth);
  const discount = 0;
  const total = subtotal - discount;

  const cartIds = items.map(({ nft }) => nft.id);

  function handleCoupon() {
    if (!coupon.trim()) {
      setCouponMessage("Digite um código promocional.");
      return;
    }

    setCouponMessage("Nenhum cupom promocional está disponível no momento.");
  }

  return (
    <div className="min-h-screen bg-[#120D0B] font-mono text-[#F4EBE3]">
      <div className="hidden md:block">
        <Header />
      </div>

      <main className="mx-auto max-w-7xl px-3 pb-12 pt-3 sm:px-6 md:px-8 md:pb-20 md:pt-8">
        {/* Breadcrumb desktop */}
        <nav className="mb-5 hidden items-center gap-2 text-[11px] font-bold md:flex">
          <Link
            to="/"
            search={{
              search: "",
              page: 1,
              network: "all",
              sort: "newest",
              category: "all",
              minPrice: "",
              maxPrice: "",
            }}
            className="text-[#E3A04F] hover:underline"
          >
            Início
          </Link>

          <span className="text-[#9C806D]">/</span>

          <Link
            to="/"
            search={{
              search: "",
              page: 1,
              network: "all",
              sort: "newest",
              category: "all",
              minPrice: "",
              maxPrice: "",
            }}
            className="text-[#E3A04F] hover:underline"
          >
            Mercado
          </Link>

          <span className="text-[#9C806D]">/</span>
          <span>Carrinho</span>
        </nav>

        <div className="rounded-[24px] bg-[#211712] px-3 pb-6 pt-5 sm:px-5 md:rounded-none md:bg-transparent md:p-0">
          {/* Topo mobile */}
          <div className="mb-6 flex items-center gap-3 md:hidden">
            <Link
              to="/"
              search={{
                search: "",
                page: 1,
                network: "all",
                sort: "newest",
                category: "all",
                minPrice: "",
                maxPrice: "",
              }}
              aria-label="Voltar ao marketplace"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4A3029]"
            >
              <ArrowLeft size={19} />
            </Link>

            <div>
              <h1 className="text-lg font-extrabold">Carrinho de NFTs</h1>

              <p className="mt-1 text-[10px] text-[#A88D79]">
                {totalItems}{" "}
                {totalItems === 1 ? "NFT selecionado" : "NFTs selecionados"}
              </p>
            </div>
          </div>

          {items.length === 0 ? (
            <div className="rounded-2xl border border-[#493124] bg-[#2B1D17] px-5 py-16 text-center">
              <ShoppingCart size={34} className="mx-auto text-[#D9944E]" />

              <h2 className="mt-5 text-xl font-bold">
                Seu carrinho está vazio
              </h2>

              <p className="mx-auto mt-3 max-w-sm text-xs leading-6 text-[#BDA694]">
                Explore o marketplace e adicione NFTs à sua coleção.
              </p>

              <Link
                to="/"
                search={{
                  search: "",
                  page: 1,
                  network: "all",
                  sort: "newest",
                  category: "all",
                  minPrice: "",
                  maxPrice: "",
                }}
                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#D9944E] px-6 py-3 text-xs font-bold text-[#120D0B]"
              >
                Explorar NFTs
                <ArrowRight size={15} />
              </Link>
            </div>
          ) : (
            <div className="grid items-start gap-7 lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[minmax(0,1fr)_330px] xl:gap-12">
              {/* LISTA DE NFTs */}
              <section aria-label="Itens do carrinho" className="min-w-0">
                {/* Cabeçalho da tabela desktop */}
                <div className="mb-1 hidden grid-cols-[minmax(0,2fr)_0.8fr_0.9fr_0.9fr_28px] items-center gap-3 border-b border-[#60402D] pb-2 text-[11px] font-bold md:grid">
                  <span>NFTs</span>
                  <span>Preço</span>
                  <span className="text-center">Edições</span>
                  <span className="text-center">Total</span>
                  <span />
                </div>

                <div className="space-y-3 md:space-y-1">
                  {items.map(({ nft, quantity }) => {
                    const itemTotal =
                      (Math.round(Number(nft.priceEth) * 100) * quantity) / 100;

                    return (
                      <article
                        key={nft.id}
                        className="overflow-hidden rounded-xl bg-[#39221C] md:grid md:grid-cols-[minmax(0,2fr)_0.8fr_0.9fr_0.9fr_28px] md:items-center md:gap-3 md:rounded-md md:bg-[#291A15] md:pr-2"
                      >
                        {/* MOBILE */}
                        <div className="flex gap-3 md:hidden">
                          <Link
                            to="/nft/$nftId"
                            params={{ nftId: nft.id }}
                            className="shrink-0"
                          >
                            <img
                              src={nft.imageUrl}
                              alt={nft.name}
                              className="h-[112px] w-[112px] object-cover"
                            />
                          </Link>

                          <div className="min-w-0 flex-1 py-3 pr-3">
                            <Link
                              to="/nft/$nftId"
                              params={{ nftId: nft.id }}
                              className="block text-xs font-bold leading-5"
                            >
                              {nft.name}
                            </Link>

                            <p className="mt-1 text-[10px] text-[#BFA28D]">
                              Edição: {nft.edition ?? `Versão ${nft.version}`}
                            </p>

                            <p className="mt-2 text-xs font-bold text-[#D9944E]">
                              {formatEth(nft.priceEth)}
                            </p>

                            <div className="mt-3 flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateQuantity(nft.id, quantity - 1)
                                  }
                                  aria-label={`Diminuir quantidade de ${nft.name}`}
                                  className="flex h-7 w-7 items-center justify-center rounded-full bg-[#D9944E] text-[#211712]"
                                >
                                  <Minus size={13} />
                                </button>

                                <span className="min-w-4 text-center text-xs font-bold">
                                  {quantity}
                                </span>

                                <button
                                  type="button"
                                  onClick={() =>
                                    updateQuantity(nft.id, quantity + 1)
                                  }
                                  disabled={quantity >= nft.available}
                                  aria-label={`Aumentar quantidade de ${nft.name}`}
                                  className="flex h-7 w-7 items-center justify-center rounded-full bg-[#D9944E] text-[#211712] disabled:opacity-40"
                                >
                                  <Plus size={13} />
                                </button>
                              </div>

                              <button
                                type="button"
                                onClick={() => removeItem(nft.id)}
                                aria-label={`Remover ${nft.name}`}
                                className="text-[#BFA28D] hover:text-red-400"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* DESKTOP: NFT */}
                        <div className="hidden min-w-0 items-center gap-3 md:flex">
                          <Link
                            to="/nft/$nftId"
                            params={{ nftId: nft.id }}
                            className="shrink-0"
                          >
                            <img
                              src={nft.imageUrl}
                              alt={nft.name}
                              className="h-[66px] w-[66px] rounded-l-md object-cover"
                            />
                          </Link>

                          <div className="min-w-0">
                            <Link
                              to="/nft/$nftId"
                              params={{ nftId: nft.id }}
                              className="block truncate text-[11px] font-bold hover:text-[#D9944E]"
                            >
                              {nft.name}
                            </Link>

                            <p className="mt-1 truncate text-[9px] text-[#D9944E]">
                              ID do token: #{nft.tokenId ?? nft.id}
                            </p>
                          </div>
                        </div>

                        {/* DESKTOP: preço */}
                        <span className="hidden whitespace-nowrap text-[11px] md:block">
                          {formatEth(nft.priceEth)}
                        </span>

                        {/* DESKTOP: quantidade */}
                        <div className="hidden items-center justify-center gap-2 md:flex">
                          <button
                            type="button"
                            onClick={() => updateQuantity(nft.id, quantity - 1)}
                            aria-label={`Diminuir quantidade de ${nft.name}`}
                            className="flex h-6 w-6 items-center justify-center rounded-full bg-[#D9944E] text-[#211712]"
                          >
                            <Minus size={12} />
                          </button>

                          <span className="min-w-3 text-center text-xs font-bold">
                            {quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() => updateQuantity(nft.id, quantity + 1)}
                            disabled={quantity >= nft.available}
                            aria-label={`Aumentar quantidade de ${nft.name}`}
                            className="flex h-6 w-6 items-center justify-center rounded-full bg-[#D9944E] text-[#211712] disabled:opacity-40"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        {/* DESKTOP: total */}
                        <span className="hidden whitespace-nowrap text-center text-[11px] font-bold text-[#D9944E] md:block">
                          {formatEth(itemTotal)}
                        </span>

                        {/* DESKTOP: remover */}
                        <button
                          type="button"
                          onClick={() => removeItem(nft.id)}
                          aria-label={`Remover ${nft.name}`}
                          className="hidden justify-self-center text-[#BFA28D] transition hover:text-red-400 md:block"
                        >
                          <Trash2 size={15} />
                        </button>
                      </article>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={clearCart}
                  className="mt-5 hidden items-center gap-2 text-[11px] text-[#A88D79] hover:text-red-400 md:inline-flex"
                >
                  <Trash2 size={13} />
                  Limpar carrinho
                </button>
              </section>

              {/* RESUMO DA CARTEIRA */}
              <aside className="min-w-0 rounded-2xl bg-[#39221C] p-4 sm:p-5 md:rounded-none md:bg-transparent md:p-0">
                <h2 className="border-b border-[#60402D] pb-3 text-sm font-bold">
                  Resumo da carteira
                </h2>

                <div className="mt-5">
                  <label
                    htmlFor="cart-coupon"
                    className="mb-2 block text-[11px] font-semibold"
                  >
                    Código promocional
                  </label>

                  <div className="flex overflow-hidden rounded-md border border-[#A66B38]">
                    <input
                      id="cart-coupon"
                      type="text"
                      value={coupon}
                      onChange={(event) => {
                        setCoupon(event.target.value);
                        setCouponMessage("");
                      }}
                      placeholder="Digite o código promocional..."
                      className="min-w-0 flex-1 bg-[#39221C] px-3 py-3 text-[10px] text-white outline-none placeholder:text-[#B89B87] md:py-2"
                    />

                    <button
                      type="button"
                      onClick={handleCoupon}
                      className="bg-[#D9944E] px-4 text-[11px] font-bold text-[#211712]"
                    >
                      Aplicar
                    </button>
                  </div>

                  {couponMessage && (
                    <p
                      role="status"
                      className="mt-2 text-[10px] leading-5 text-[#D9944E]"
                    >
                      {couponMessage}
                    </p>
                  )}
                </div>

                <div className="mt-6 space-y-3 text-[11px]">
                  <div className="flex justify-between gap-3">
                    <span className="text-[#C9B3A1]">Subtotal</span>
                    <span>{formatEth(subtotal)}</span>
                  </div>

                  <div className="flex justify-between gap-3">
                    <span className="text-[#C9B3A1]">
                      Desconto do lançamento
                    </span>
                    <span>{formatEth(discount)}</span>
                  </div>

                  <div className="flex justify-between gap-3">
                    <span className="text-[#C9B3A1]">Taxa de rede</span>
                    <span>Não calculada</span>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-[#60402D] pt-4">
                  <span className="text-sm font-bold">Total</span>

                  <span className="text-sm font-extrabold text-[#D9944E]">
                    {formatEth(total)}
                  </span>
                </div>

                <Link
                  to="/checkout"
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-md bg-[#D9944E] px-4 py-3 text-xs font-bold text-[#211712] transition hover:bg-[#E9A963]"
                >
                  Conectar e finalizar
                  <ArrowRight size={15} />
                </Link>

                <Link
                  to="/"
                  search={{
                    search: "",
                    page: 1,
                    network: "all",
                    sort: "newest",
                    category: "all",
                    minPrice: "",
                    maxPrice: "",
                  }}
                  className="mt-4 flex items-center justify-center text-[11px] text-[#D9944E] hover:underline"
                >
                  Continuar explorando
                </Link>

                <p className="mt-4 flex items-center justify-center gap-2 text-[10px] text-[#A88D79]">
                  <ShieldCheck size={13} />
                  Checkout demonstrativo
                </p>
              </aside>

              {/* Limpar carrinho mobile */}
              <button
                type="button"
                onClick={clearCart}
                className="flex items-center justify-center gap-2 text-[11px] text-[#A88D79] md:hidden"
              >
                <Trash2 size={13} />
                Esvaziar carrinho
              </button>
            </div>
          )}
        </div>

        {/* Seção desktop do Figma */}
        <RecommendedNFTs cartIds={cartIds} />
      </main>

      <div className="hidden md:block">
        <Footer />
      </div>
    </div>
  );
}

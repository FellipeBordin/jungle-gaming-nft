import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Heart,
  Maximize2,
  Minus,
  Plus,
  Share2,
  ShoppingCart,
  Star,
  X,
} from "lucide-react";

import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { useCart } from "../hooks/useCart";
import type { NFT, NFTListResponse } from "../types/nft";

const marketplaceSearch = {
  search: "",
  page: 1,
  network: "all" as const,
  sort: "newest" as const,
};

const networkLabels: Record<NFT["network"], string> = {
  ethereum: "Ethereum",
  polygon: "Polygon",
  solana: "Solana",
};

async function fetchNFT(id: string): Promise<NFT | null> {
  const response = await fetch(`/api/nfts/${encodeURIComponent(id)}`);

  if (response.status === 404) return null;

  if (!response.ok) {
    throw new Error("Não foi possível carregar o NFT.");
  }

  return (await response.json()) as NFT;
}

async function fetchRelatedNFTs(): Promise<NFT[]> {
  const response = await fetch("/api/nfts?page=1");

  if (!response.ok) {
    throw new Error("Não foi possível carregar os NFTs relacionados.");
  }

  const data = (await response.json()) as NFTListResponse;
  return data.items;
}

type DetailsContentProps = {
  nft: NFT;
  desktop?: boolean;
};

function DetailsContent({ nft, desktop = false }: DetailsContentProps) {
  const navigate = useNavigate();

  const { items, addItem, updateQuantity } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [selectedEdition, setSelectedEdition] = useState(nft.edition ?? "");
  const [favorite, setFavorite] = useState(false);
  const [feedback, setFeedback] = useState("");

  const quantityInCart =
    items.find((item) => item.nft.id === nft.id)?.quantity ?? 0;

  const availableToAdd = Math.max(0, nft.available - quantityInCart);

  const canAdd = availableToAdd > 0;

  const selectedQuantity = Math.min(quantity, Math.max(1, availableToAdd));

  const totalPrice = (
    (Math.round(Number(nft.priceEth) * 100) * selectedQuantity) /
    100
  ).toFixed(2);

  const editions = nft.editions?.length
    ? nft.editions
    : [nft.edition ?? `Versão ${nft.version}`];

  function addSelectedItems() {
    if (!canAdd) return false;

    const amount = selectedQuantity;

    if (quantityInCart === 0) {
      addItem(nft);

      if (amount > 1) {
        updateQuantity(nft.id, amount);
      }
    } else {
      updateQuantity(nft.id, quantityInCart + amount);
    }

    setQuantity(1);
    setFeedback(
      `${amount} ${
        amount === 1 ? "unidade adicionada" : "unidades adicionadas"
      } ao carrinho.`,
    );

    return true;
  }

  function buyNFT() {
    if (addSelectedItems()) {
      void navigate({ to: "/cart" });
    }
  }

  function toggleFavorite() {
    setFavorite((current) => !current);
  }

  const editionButtons = (
    <div className="flex flex-wrap gap-2">
      {editions.map((edition) => {
        const active = selectedEdition === edition;

        return (
          <button
            key={edition}
            type="button"
            onClick={() => setSelectedEdition(edition)}
            aria-pressed={active}
            className={`rounded-full border px-3 py-1.5 text-[11px] font-bold transition ${
              active
                ? "border-[#E8A34F] bg-[#E8A34F]/15 text-[#F3B968]"
                : "border-[#80604B] text-[#E4D1C1] hover:border-[#E8A34F]"
            }`}
          >
            {edition}
          </button>
        );
      })}
    </div>
  );

  const rating = nft.rating !== undefined && (
    <div className="flex shrink-0 items-center gap-1 text-[11px]">
      <Star size={14} className="text-[#E8A34F]" fill="currentColor" />
      <span className="font-bold">{nft.rating.toFixed(1)}</span>
      {nft.reviewCount !== undefined && (
        <span className="text-[#C9B4A1]">({nft.reviewCount})</span>
      )}
    </div>
  );

  const metadata = (
    <dl className="space-y-2 text-xs leading-6 text-[#E9D8C7]">
      <div>
        <dt className="inline font-bold">ID do token: </dt>
        <dd className="inline">#{nft.tokenId ?? nft.id}</dd>
      </div>

      <div>
        <dt className="inline font-bold">Coleção: </dt>
        <dd className="inline">{nft.collection}</dd>
      </div>

      <div>
        <dt className="inline font-bold">Atributos: </dt>
        <dd className="inline">
          {nft.attributes?.join(", ") ?? "Não informados"}
        </dd>
      </div>

      <div>
        <dt className="inline font-bold">Blockchain: </dt>
        <dd className="inline">{networkLabels[nft.network]}</dd>
      </div>
    </dl>
  );

  const quantityControl = (
    <div className="flex items-center gap-3">
      <span className="text-xs font-bold">Qtd.</span>

      <button
        type="button"
        onClick={() => setQuantity((current) => Math.max(1, current - 1))}
        disabled={!canAdd || selectedQuantity <= 1}
        aria-label="Diminuir quantidade"
        className="flex h-9 w-8 items-center justify-center rounded-lg bg-[#D9944E] text-[#211712] disabled:opacity-40"
      >
        <Minus size={15} />
      </button>

      <span className="min-w-4 text-center text-sm font-bold">
        {selectedQuantity}
      </span>

      <button
        type="button"
        onClick={() =>
          setQuantity((current) => Math.min(current + 1, availableToAdd))
        }
        disabled={!canAdd || selectedQuantity >= availableToAdd}
        aria-label="Aumentar quantidade"
        className="flex h-9 w-8 items-center justify-center rounded-lg bg-[#D9944E] text-[#211712] disabled:opacity-40"
      >
        <Plus size={15} />
      </button>
    </div>
  );

  if (!desktop) {
    return (
      <div className="relative -mt-3 rounded-t-[26px] bg-[#2B1B18] px-5 pb-7 pt-7 text-[#F3EAE2]">
        <div className="flex items-start justify-between gap-3">
          <h1 className="min-w-0 text-xl font-extrabold">{nft.name}</h1>
          {rating}
        </div>

        <p className="mt-5 text-xs leading-6 text-[#D2BBA8]">
          {nft.description ??
            `Colecionável digital da coleção ${nft.collection}.`}
        </p>

        <div className="mt-5">
          <p className="mb-3 text-xs font-bold">Edição:</p>
          {editionButtons}
        </div>

        <div className="mt-6">{metadata}</div>

        <section className="mt-7 rounded-[22px] bg-[#1A1110] p-4">
          <div className="flex items-center justify-between gap-3">
            {quantityControl}

            <span className="text-lg font-extrabold text-[#D9944E]">
              {totalPrice} ETH
            </span>
          </div>

          <div className="mt-5 grid grid-cols-[1fr_52px] gap-3">
            <button
              type="button"
              onClick={buyNFT}
              disabled={!canAdd}
              className="min-h-12 rounded-full bg-[#D9944E] px-4 text-xs font-extrabold text-[#211712] disabled:opacity-40"
            >
              {canAdd ? "Comprar NFT" : "Indisponível"}
            </button>

            <button
              type="button"
              onClick={addSelectedItems}
              disabled={!canAdd}
              aria-label="Adicionar ao carrinho"
              className="flex items-center justify-center rounded-full bg-[#4A2420] text-[#F3D39E] disabled:opacity-40"
            >
              <ShoppingCart size={20} />
            </button>
          </div>

          {feedback && (
            <p
              role="status"
              className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-[#D9944E]"
            >
              <CheckCircle2 size={15} />
              {feedback}
            </p>
          )}

          {quantityInCart > 0 && (
            <Link
              to="/cart"
              className="mt-4 block text-center text-xs text-[#D9944E] underline"
            >
              Ver carrinho ({quantityInCart})
            </Link>
          )}
        </section>

        <p className="mt-4 text-center text-[10px] leading-5 text-[#A88D79]">
          Marketplace demonstrativo. Nenhuma transação real em blockchain será
          realizada.
        </p>
      </div>
    );
  }

  return (
    <div className="min-w-0 text-[#F3EAE2]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold xl:text-3xl">{nft.name}</h1>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-[#725849] pb-3">
        <span className="text-lg font-extrabold text-[#E8A34F]">
          {Number(nft.priceEth).toFixed(2)} ETH
        </span>

        <div className="flex items-center gap-2">
          {rating}
          <span className="text-[11px] text-[#D4C2B3]">
            avaliações de colecionadores
          </span>
        </div>
      </div>

      <div className="mt-4">
        <h2 className="text-xs font-bold">Sobre este NFT:</h2>
        <p className="mt-2 max-w-xl text-xs leading-6 text-[#D6C1AF]">
          {nft.description ??
            `Colecionável digital da coleção ${nft.collection}.`}
        </p>
      </div>

      <div className="mt-4">
        <p className="mb-2 text-xs font-bold">Edição:</p>
        {editionButtons}
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
        {quantityControl}

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={buyNFT}
            disabled={!canAdd}
            className="rounded-lg bg-[#E8A34F] px-7 py-3 text-xs font-bold uppercase text-[#291911] transition hover:bg-[#F5B86D] disabled:opacity-40"
          >
            {canAdd ? "Comprar" : "Indisponível"}
          </button>

          <button
            type="button"
            onClick={toggleFavorite}
            aria-pressed={favorite}
            className="flex items-center gap-2 rounded-lg border border-[#E8A34F] px-4 py-3 text-xs font-bold text-[#E8A34F]"
          >
            <Heart size={16} fill={favorite ? "currentColor" : "none"} />
            {favorite ? "Favoritado" : "Favoritar"}
          </button>
        </div>
      </div>

      <div className="mt-4 text-right text-sm font-bold text-[#E8A34F]">
        Total: {totalPrice} ETH
      </div>

      <div className="mt-5">{metadata}</div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={addSelectedItems}
          disabled={!canAdd}
          className="flex items-center gap-2 text-xs font-bold text-[#E8A34F] disabled:opacity-40"
        >
          <ShoppingCart size={16} />
          Adicionar ao carrinho
        </button>

        {quantityInCart > 0 && (
          <Link to="/cart" className="text-xs text-[#E8A34F] underline">
            Ver carrinho ({quantityInCart})
          </Link>
        )}
      </div>

      {feedback && (
        <p role="status" className="mt-3 text-xs text-[#E8A34F]">
          {feedback}
        </p>
      )}

      <div className="mt-5 flex items-center gap-2 text-xs text-[#CDB6A5]">
        <Share2 size={15} />
        Compartilhe este NFT
        <span className="text-[#E8A34F]">· {networkLabels[nft.network]}</span>
      </div>
    </div>
  );
}

function DesktopGallery({ nft }: { nft: NFT }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);

  // O mock fornece apenas uma imagem por NFT.
  // Repetimos a imagem nas miniaturas até existir uma galeria real.
  const images = Array.from({ length: 4 }, () => nft.imageUrl);

  return (
    <>
      <div className="grid grid-cols-[70px_minmax(0,1fr)] gap-4 xl:grid-cols-[82px_minmax(0,1fr)]">
        <div className="flex flex-col gap-3">
          {images.map((src, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setSelectedImage(index)}
              aria-label={`Visualizar imagem ${index + 1}`}
              aria-pressed={selectedImage === index}
              className={`aspect-square overflow-hidden rounded-lg border-2 ${
                selectedImage === index
                  ? "border-[#E8A34F]"
                  : "border-transparent"
              }`}
            >
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>

        <div className="relative aspect-square overflow-hidden rounded-xl bg-[#38271F]">
          <img
            src={images[selectedImage]}
            alt={nft.name}
            className="h-full w-full object-cover"
          />

          <button
            type="button"
            onClick={() => setZoomOpen(true)}
            aria-label="Ampliar imagem"
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-[#1A1110]/75 text-white"
          >
            <Maximize2 size={18} />
          </button>
        </div>
      </div>

      {zoomOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Imagem ampliada de ${nft.name}`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-5"
        >
          <button
            type="button"
            onClick={() => setZoomOpen(false)}
            aria-label="Fechar imagem"
            className="absolute right-5 top-5 rounded-full bg-[#38251C] p-3 text-white"
          >
            <X size={22} />
          </button>

          <img
            src={images[selectedImage]}
            alt={nft.name}
            className="max-h-[85vh] max-w-full rounded-xl object-contain"
          />
        </div>
      )}
    </>
  );
}

function DesktopExtraSections({ nft }: { nft: NFT }) {
  const [activeTab, setActiveTab] = useState<"details" | "reviews">("details");

  const [relatedPage, setRelatedPage] = useState(0);

  const { data: related = [], isError } = useQuery({
    queryKey: ["related-nfts"],
    queryFn: fetchRelatedNFTs,
  });

  const relatedNFTs = related.filter((item) => item.id !== nft.id);

  const visibleRelated = relatedNFTs.slice(
    relatedPage * 5,
    relatedPage * 5 + 5,
  );

  const maxPage = Math.max(0, Math.ceil(relatedNFTs.length / 5) - 1);

  return (
    <>
      {/* Abas */}
      <section className="mt-16">
        <div className="flex flex-wrap gap-8 border-b border-[#765C4B]">
          <button
            type="button"
            onClick={() => setActiveTab("details")}
            className={`border-b-2 pb-3 text-sm font-bold ${
              activeTab === "details"
                ? "border-[#E8A34F] text-[#E8A34F]"
                : "border-transparent text-[#E2D3C7]"
            }`}
          >
            Detalhes do NFT
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("reviews")}
            className={`border-b-2 pb-3 text-sm font-bold ${
              activeTab === "reviews"
                ? "border-[#E8A34F] text-[#E8A34F]"
                : "border-transparent text-[#E2D3C7]"
            }`}
          >
            Avaliações de colecionadores ({nft.reviewCount ?? 0})
          </button>
        </div>

        {activeTab === "details" ? (
          <div className="max-w-5xl space-y-5 py-5 text-xs leading-7 text-[#D8C5B5]">
            <p>
              {nft.name} é um colecionável digital da coleção {nft.collection}.{" "}
              {nft.description}
            </p>

            <p>
              A obra faz parte do catálogo demonstrativo Kurio. Os metadados
              apresentados nesta página foram preparados para a experiência do
              marketplace.
            </p>

            <div>
              <p className="font-bold text-[#F3EAE2]">Rede:</p>
              <p>{networkLabels[nft.network]}</p>
            </div>

            <div>
              <p className="font-bold text-[#F3EAE2]">Edição:</p>
              <p>{nft.edition ?? `Versão ${nft.version}`}</p>
            </div>

            <div>
              <p className="font-bold text-[#F3EAE2]">Atributos:</p>
              <p>{nft.attributes?.join(", ") ?? "Não informados"}</p>
            </div>

            <div>
              <p className="font-bold text-[#F3EAE2]">Identificador:</p>
              <p>#{nft.tokenId ?? nft.id}</p>
            </div>
          </div>
        ) : (
          <div className="py-8">
            <div className="flex items-center gap-3">
              <Star size={23} fill="currentColor" className="text-[#E8A34F]" />

              <span className="text-2xl font-extrabold">
                {nft.rating?.toFixed(1) ?? "—"}
              </span>

              <span className="text-sm text-[#BFA28D]">
                {nft.reviewCount ?? 0} avaliações
              </span>
            </div>

            <p className="mt-4 text-sm text-[#CDB6A5]">
              Avaliação demonstrativa do catálogo. Comentários individuais ainda
              não estão disponíveis na API.
            </p>
          </div>
        )}
      </section>

      {/* NFTs relacionados */}
      <section className="mt-14">
        <div className="flex items-center justify-between border-b border-[#765C4B] pb-3">
          <h2 className="text-sm font-bold text-[#E8A34F]">
            Mais desta coleção
          </h2>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setRelatedPage((page) => Math.max(0, page - 1))}
              disabled={relatedPage === 0}
              aria-label="Página anterior"
              className="rounded-full border border-[#765C4B] p-2 disabled:opacity-30"
            >
              <ChevronLeft size={16} />
            </button>

            <button
              type="button"
              onClick={() =>
                setRelatedPage((page) => Math.min(maxPage, page + 1))
              }
              disabled={relatedPage >= maxPage}
              aria-label="Próxima página"
              className="rounded-full border border-[#765C4B] p-2 disabled:opacity-30"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {isError && (
          <p className="mt-5 text-xs text-[#CDB6A5]">
            Não foi possível carregar outros NFTs.
          </p>
        )}

        {!isError && visibleRelated.length === 0 && (
          <p className="mt-5 text-xs text-[#CDB6A5]">
            Nenhum outro NFT disponível nesta página.
          </p>
        )}

        <div className="mt-5 grid grid-cols-5 gap-4">
          {visibleRelated.map((item) => (
            <Link
              key={item.id}
              to="/nft/$nftId"
              params={{ nftId: item.id }}
              className="group min-w-0"
            >
              <div className="aspect-square overflow-hidden rounded-lg bg-[#33231D]">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
              </div>

              <p className="mt-3 truncate text-xs font-bold">{item.name}</p>

              <p className="mt-1 text-xs font-bold text-[#E8A34F]">
                {Number(item.priceEth).toFixed(2)} ETH
              </p>
            </Link>
          ))}
        </div>

        {maxPage > 0 && (
          <div className="mt-6 flex justify-center gap-2">
            {Array.from({ length: maxPage + 1 }, (_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setRelatedPage(index)}
                aria-label={`Página ${index + 1}`}
                aria-pressed={relatedPage === index}
                className={`h-2.5 w-2.5 rounded-full ${
                  relatedPage === index
                    ? "bg-[#E8A34F]"
                    : "border border-[#E8A34F]"
                }`}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

export function NFTDetails() {
  const { nftId } = useParams({
    from: "/nft/$nftId",
  });

  const [zoomMobile, setZoomMobile] = useState(false);

  const {
    data: nft,
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["nft-details", nftId],
    queryFn: () => fetchNFT(nftId),
    retry: 1,
  });

  return (
    <div className="min-h-screen bg-[#120D0B] text-[#F3EAE2]">
      <div className="hidden md:block">
        <Header />
      </div>

      <main className="mx-auto max-w-6xl pb-12 md:px-6 md:py-8">
        {isPending && (
          <div
            role="status"
            className="grid animate-pulse gap-8 p-5 md:grid-cols-2"
          >
            <div className="aspect-square rounded-xl bg-[#302018]" />
            <div className="space-y-5">
              <div className="h-10 rounded bg-[#302018]" />
              <div className="h-24 rounded bg-[#302018]" />
              <div className="h-40 rounded bg-[#302018]" />
            </div>
          </div>
        )}

        {isError && (
          <div
            role="alert"
            className="mx-4 rounded-xl bg-[#291B17] p-8 text-center"
          >
            <h1 className="text-xl font-bold">Erro ao carregar o NFT</h1>

            <button
              type="button"
              onClick={() => void refetch()}
              className="mt-5 rounded-lg bg-[#D9944E] px-6 py-3 text-sm font-bold text-[#211712]"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {!isPending && !isError && !nft && (
          <div className="p-10 text-center">
            <h1 className="text-2xl font-bold">NFT não encontrado</h1>

            <Link
              to="/"
              search={marketplaceSearch}
              className="mt-5 inline-block text-[#E8A34F] underline"
            >
              Voltar ao marketplace
            </Link>
          </div>
        )}

        {!isPending && !isError && nft && (
          <>
            {/* MOBILE: mantém o layout anterior */}
            <div className="mx-auto max-w-[560px] md:hidden">
              <div className="relative aspect-square bg-[#33241C]">
                <img
                  src={nft.imageUrl}
                  alt={nft.name}
                  className="h-full w-full object-cover"
                />

                <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
                  <Link
                    to="/"
                    search={marketplaceSearch}
                    aria-label="Voltar"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-[#211712]/85"
                  >
                    <ArrowLeft size={20} />
                  </Link>

                  <button
                    type="button"
                    onClick={() => setZoomMobile(true)}
                    aria-label="Ampliar imagem"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-[#211712]/85"
                  >
                    <Maximize2 size={18} />
                  </button>
                </div>
              </div>

              <DetailsContent key={`mobile-${nft.id}`} nft={nft} />
            </div>

            {zoomMobile && (
              <div
                role="dialog"
                aria-modal="true"
                aria-label="Imagem ampliada"
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-5 md:hidden"
              >
                <button
                  type="button"
                  onClick={() => setZoomMobile(false)}
                  aria-label="Fechar imagem"
                  className="absolute right-5 top-5 rounded-full bg-[#38251C] p-3"
                >
                  <X size={22} />
                </button>

                <img
                  src={nft.imageUrl}
                  alt={nft.name}
                  className="max-h-[85vh] max-w-full object-contain"
                />
              </div>
            )}

            {/* DESKTOP: estrutura do Figma */}
            <div className="hidden md:block">
              <div className="mb-5 flex items-center gap-2 text-xs font-bold">
                <Link
                  to="/"
                  search={marketplaceSearch}
                  className="text-[#E8A34F] hover:underline"
                >
                  Início
                </Link>

                <span className="text-[#A78D7B]">/</span>

                <Link
                  to="/"
                  search={marketplaceSearch}
                  className="text-[#E8A34F] hover:underline"
                >
                  Mercado
                </Link>
              </div>

              <div className="grid items-start gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-10">
                <DesktopGallery key={nft.id} nft={nft} />

                <DetailsContent key={`desktop-${nft.id}`} nft={nft} desktop />
              </div>

              <DesktopExtraSections key={`extras-${nft.id}`} nft={nft} />
            </div>
          </>
        )}
      </main>

      <div className="hidden md:block">
        <Footer />
      </div>
    </div>
  );
}

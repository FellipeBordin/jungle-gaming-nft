import { useState } from "react";
import { api } from "../services/api";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Header } from "./Header";
import { NFTCard } from "./NFTCard";
import { MarketplaceFilters, type NFTCategory } from "./MarketplaceFilters";
import { SidebarFeaturedNFT } from "./SidebarFeaturedNFT";
import { PromotionalBanners } from "./PromotionalBanners";
import { MintingJournal } from "./MintingJournal";
import { Footer } from "./Footer";
import { defaultMarketplaceSearch } from "../constants/marketplace";
import type { NFT, NFTListResponse } from "../types/nft";
export interface MarketplaceSearch {
  search: string;
  page: number;
  network: "all" | "ethereum" | "polygon" | "solana";
  sort: "newest" | "price_asc" | "price_desc";
}
interface MarketplaceContentProps {
  filters: MarketplaceSearch;
  background?: boolean;
}
type MarketplaceTab = "all" | "new" | "trending";
const PAGE_SIZE = 9;
const NEW_NFT_IDS = new Set(["7", "8", "9"]);
const TRENDING_NFT_IDS = new Set(["3", "6", "8"]);
const tabs: { id: MarketplaceTab; label: string }[] = [
  { id: "all", label: "Todos os NFTs" },
  { id: "new", label: "Novos lançamentos" },
  { id: "trending", label: "Em alta" },
];
function buildNFTUrl(filters: MarketplaceSearch, page: number): string {
  const params = new URLSearchParams({
    page: String(page),
    search: filters.search,
    network: filters.network,
    sort: filters.sort,
  });
  return `/nfts?${params.toString()}`;
}
async function fetchAllNFTs(filters: MarketplaceSearch): Promise<NFT[]> {
  const { data: firstPage } = await api.get<NFTListResponse>(
    buildNFTUrl(filters, 1),
  );

  const totalPages = Math.ceil(firstPage.total / firstPage.pageSize);

  if (totalPages <= 1) {
    return firstPage.items;
  }

  const remainingPages = await Promise.all(
    Array.from({ length: totalPages - 1 }, async (_, index) => {
      const { data } = await api.get<NFTListResponse>(
        buildNFTUrl(filters, index + 2),
      );

      return data;
    }),
  );

  return [...firstPage.items, ...remainingPages.flatMap((page) => page.items)];
}
export function MarketplaceContent({
  filters,
  background = false,
}: MarketplaceContentProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<MarketplaceTab>("all");
  const [category, setCategory] = useState<NFTCategory>("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [localPage, setLocalPage] = useState(1);
  const query = useQuery({
    queryKey: [
      "marketplace-complete-catalog",
      filters.search,
      filters.network,
      filters.sort,
    ],
    queryFn: () => fetchAllNFTs(filters),
  });
  const allNFTs = query.data ?? [];
  const loading = query.isPending;
  const hasError = query.isError;
  const hasLocalFilters =
    category !== "all" || minPrice !== "" || maxPrice !== "";
  const usesLocalPagination = activeTab !== "all" || hasLocalFilters;
  const filteredNFTs = allNFTs.filter((nft) => {
    if (category !== "all" && nft.collection !== category) {
      return false;
    }
    const price = Number(nft.priceEth);
    if (minPrice !== "" && price < Number(minPrice)) {
      return false;
    }
    if (maxPrice !== "" && price > Number(maxPrice)) {
      return false;
    }
    if (activeTab === "new" && !NEW_NFT_IDS.has(nft.id)) {
      return false;
    }
    if (activeTab === "trending" && !TRENDING_NFT_IDS.has(nft.id)) {
      return false;
    }
    return true;
  });
  const totalResults = filteredNFTs.length;
  const totalPages = Math.max(1, Math.ceil(totalResults / PAGE_SIZE));
  const currentPage = usesLocalPagination ? localPage : filters.page;
  const safePage = Math.min(Math.max(currentPage, 1), totalPages);
  const displayedNFTs = filteredNFTs.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );
  function updateFilters(next: Partial<MarketplaceSearch>) {
    if (background) return;
    setLocalPage(1);
    void navigate({
      to: "/",
      search: {
        ...filters,
        ...next,
        page: 1,
      },
    });
  }
  function changeNetwork(network: MarketplaceSearch["network"]) {
    updateFilters({ network });
  }
  function changeSort(sort: MarketplaceSearch["sort"]) {
    updateFilters({ sort });
  }
  function changeCategory(nextCategory: NFTCategory) {
    if (background) return;
    setCategory(nextCategory);
    setLocalPage(1);
  }
  function changeMinPrice(value: string) {
    if (background) return;
    setMinPrice(value);
    setLocalPage(1);
  }
  function changeMaxPrice(value: string) {
    if (background) return;
    setMaxPrice(value);
    setLocalPage(1);
  }
  function changeTab(tab: MarketplaceTab) {
    if (background) return;
    setActiveTab(tab);
    setLocalPage(1);
  }
  function changePage(page: number) {
    if (background || page < 1 || page > totalPages) return;
    if (usesLocalPagination) {
      setLocalPage(page);
    } else {
      void navigate({
        to: "/",
        search: { ...filters, page },
      });
    }
    document.getElementById("marketplace-results")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
  function clearFilters() {
    if (background) return;
    setActiveTab("all");
    setCategory("all");
    setMinPrice("");
    setMaxPrice("");
    setLocalPage(1);
    void navigate({ to: "/", search: defaultMarketplaceSearch });
  }
  const visiblePageNumbers = Array.from(
    { length: Math.min(4, totalPages) },
    (_, index) => {
      const start = Math.min(
        Math.max(1, safePage - 1),
        Math.max(1, totalPages - 3),
      );
      return start + index;
    },
  );

  return (
    <div className="min-h-screen bg-[#140D0A] font-mono text-white">
      <Header />

      <main className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        {/* HERO — DESKTOP E MOBILE */}
        <section className="relative pt-3 pb-5 sm:py-10 md:grid md:grid-cols-[1.15fr_0.85fr] md:items-center md:gap-14 md:py-16">
          {/* HERO MOBILE */}
          <div className="md:hidden">
            <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] items-center gap-3 overflow-hidden rounded-2xl bg-[#38251C] p-3">
              {/* TEXTO */}
              <div className="min-w-0">
                <p className="mb-2 font-mono text-[10px] font-semibold text-[#E9D9C9]">
                  Bem-vindo à Kurio
                </p>

                <h1 className="font-mono text-[clamp(13px,3.8vw,18px)] font-extrabold leading-[1.3] text-[#F2EBE5]">
                  SEJA DONO DA CULTURA DIGITAL
                </h1>

                <p className="mt-2 font-mono text-[9px] leading-[1.5] text-[#C8A98C]">
                  Descubra NFTs selecionados de criadores do mundo todo.
                </p>

                <a
                  href="#marketplace"
                  tabIndex={background ? -1 : undefined}
                  className="mt-2 inline-flex items-center gap-1 font-mono text-[10px] font-bold text-[#D9944E]"
                >
                  EXPLORAR
                  <span aria-hidden="true">→</span>
                </a>
              </div>

              {/* IMAGEM */}
              <div className="aspect-square min-w-0 overflow-hidden rounded-xl bg-[#E7E4C7]">
                <img
                  src="/nfts/ape-green.png"
                  alt="Macaco com jaqueta verde e óculos"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            {/* INDICADORES */}
            <div
              className="mt-2 flex items-center justify-center gap-1.5"
              aria-hidden="true"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#D9944E]" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#D9944E]/50" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#D9944E]/50" />
            </div>
          </div>

          {/* HERO DESKTOP */}
          <div className="hidden min-w-0 md:block md:pl-6">
            <p className="mb-4 text-sm tracking-[0.12em] text-[#E9D9C9]">
              Bem-vindo à Kurio
            </p>

            <h1 className="max-w-2xl text-[clamp(1.75rem,3.5vw,3.5rem)] font-extrabold leading-[1.3] tracking-[0.015em] text-[#F2EBE5]">
              SEJA DONO DO FUTURO
              <span className="block">DA ARTE DIGITAL</span>
            </h1>

            <p className="mt-5 max-w-lg text-sm leading-6 text-[#C8A98C]">
              Descubra NFTs selecionados de criadores emergentes e consagrados.
              Colecione arte digital rara, apoie artistas e tenha uma parte da
              cultura da internet.
            </p>

            <a
              href="#marketplace"
              tabIndex={background ? -1 : undefined}
              className="mt-7 inline-flex items-center justify-center rounded-xl bg-[#D9944E] px-7 py-3 text-xs font-bold text-[#120D0B] transition hover:bg-[#E9A963]"
            >
              EXPLORAR
            </a>

            <div
              className="mt-10 flex items-center justify-end gap-2 pr-8"
              aria-hidden="true"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#D9944E]" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#D9944E]/60" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#D9944E]/60" />
            </div>
          </div>

          {/* IMAGEM DESKTOP */}
          <div className="hidden aspect-square w-full max-w-97.5 overflow-hidden rounded-2xl bg-[#E7E4C7] md:block md:mr-0">
            <img
              src="/nfts/ape-green.png"
              alt="Macaco com jaqueta verde e óculos, NFT em destaque"
              className="h-full w-full object-cover"
            />
          </div>
        </section>

        {/* MARKETPLACE */}
        <section id="marketplace" className="scroll-mt-24 pt-1 md:pt-8">
          <div className="grid items-start gap-7 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-9">
            {/* COLUNA ESQUERDA */}
            <div className="hidden min-w-0 lg:block">
              <MarketplaceFilters
                nfts={allNFTs}
                network={filters.network}
                sort={filters.sort}
                category={category}
                minPrice={minPrice}
                maxPrice={maxPrice}
                onNetworkChange={changeNetwork}
                onSortChange={changeSort}
                onCategoryChange={changeCategory}
                onMinPriceChange={changeMinPrice}
                onMaxPriceChange={changeMaxPrice}
                onClear={clearFilters}
                disabled={background}
              />

              {!background && (
                <div className="hidden lg:block">
                  <SidebarFeaturedNFT />
                </div>
              )}
            </div>

            {/* COLUNA DIREITA */}
            <div id="marketplace-results" className="min-w-0 scroll-mt-24">
              {/* FILTROS MOBILE E TABLET */}
              <div className="mb-5 lg:hidden">
                <MarketplaceFilters
                  nfts={allNFTs}
                  network={filters.network}
                  sort={filters.sort}
                  category={category}
                  minPrice={minPrice}
                  maxPrice={maxPrice}
                  onNetworkChange={changeNetwork}
                  onSortChange={changeSort}
                  onCategoryChange={changeCategory}
                  onMinPriceChange={changeMinPrice}
                  onMaxPriceChange={changeMaxPrice}
                  onClear={clearFilters}
                  disabled={background}
                />
              </div>
              <div className="mb-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-b border-[#38251C] md:mb-5">
                <div
                  role="tablist"
                  aria-label="Seleções do marketplace"
                  className="flex min-w-0 items-center gap-4 overflow-x-auto sm:gap-6"
                >
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      aria-selected={activeTab === tab.id}
                      disabled={background}
                      onClick={() => changeTab(tab.id)}
                      className={`shrink-0 border-b-2 pb-3 text-[11px] font-semibold transition sm:text-xs ${
                        activeTab === tab.id
                          ? "border-[#D9944E] text-[#D9944E]"
                          : "border-transparent text-[#D8C5B4] hover:text-white"
                      } disabled:cursor-not-allowed`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <span className="pb-3 text-[10px] text-[#BFA28D] sm:text-xs">
                  {totalResults} {totalResults === 1 ? "NFT" : "NFTs"}
                </span>
              </div>

              {/* SKELETON LOADING — REDUZ DESLOCAMENTO VISUAL */}
              {loading && (
                <div role="status" aria-label="Carregando NFTs">
                  <span className="sr-only">Carregando NFTs...</span>

                  <div
                    aria-hidden="true"
                    className="grid grid-cols-2 items-start gap-x-4 gap-y-7 sm:gap-x-5 sm:gap-y-9 lg:grid-cols-3"
                  >
                    {Array.from({ length: 9 }, (_, index) => (
                      <div
                        key={index}
                        className={
                          index % 2 === 1 ? "relative top-12 lg:top-0" : ""
                        }
                      >
                        <div className="min-w-0 motion-safe:animate-pulse">
                          <div className="aspect-square rounded-xl bg-[#38251C]" />

                          <div className="px-1 pt-2">
                            <div className="h-4 w-4/5 rounded bg-[#38251C]" />
                            <div className="mt-2 h-4 w-2/5 rounded bg-[#38251C]" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ERRO AO CARREGAR NFTs */}
              {hasError && (
                <div
                  role="alert"
                  className="rounded-lg border border-red-900 bg-[#211712] p-8 text-center"
                >
                  <p className="text-sm text-red-400">
                    Não foi possível carregar os NFTs.
                  </p>

                  {!background && (
                    <button
                      type="button"
                      onClick={() => void query.refetch()}
                      className="mt-4 rounded bg-[#D9944E] px-5 py-2.5 text-xs font-bold text-[#120D0B]"
                    >
                      Tentar novamente
                    </button>
                  )}
                </div>
              )}

              {/* LISTAGEM DOS NFTs */}
              {!loading && !hasError && displayedNFTs.length > 0 && (
                <div className="grid grid-cols-2 items-start gap-x-4 gap-y-7 sm:gap-x-5 sm:gap-y-9 lg:grid-cols-3">
                  {displayedNFTs.map((nft, index) => (
                    <div
                      key={nft.id}
                      className={
                        index % 2 === 1 ? "relative top-12 lg:top-0" : ""
                      }
                    >
                      <NFTCard nft={nft} />
                    </div>
                  ))}
                </div>
              )}

              {/* NENHUM NFT ENCONTRADO */}
              {!loading && !hasError && displayedNFTs.length === 0 && (
                <div className="rounded-lg border border-[#38251C] bg-[#211712] p-10 text-center">
                  <h2 className="text-lg font-bold">Nenhum NFT encontrado</h2>

                  <p className="mt-3 text-sm text-[#BFA28D]">
                    Tente alterar a busca ou os filtros.
                  </p>

                  {!background && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="mt-5 rounded bg-[#D9944E] px-5 py-3 text-xs font-bold text-[#120D0B]"
                    >
                      Limpar filtros
                    </button>
                  )}
                </div>
              )}

              {/* PAGINAÇÃO */}
              {!loading && !hasError && totalPages > 1 && (
                <nav
                  aria-label="Paginação dos NFTs"
                  className="mt-12 flex flex-wrap items-center justify-end gap-2"
                >
                  <button
                    type="button"
                    disabled={background || safePage === 1}
                    onClick={() => changePage(safePage - 1)}
                    aria-label="Página anterior"
                    className="flex h-9 w-9 items-center justify-center rounded border border-[#493023] text-[#D9C5B3] transition hover:border-[#D9944E] disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <ChevronLeft size={15} />
                  </button>

                  {visiblePageNumbers.map((page) => (
                    <button
                      key={page}
                      type="button"
                      disabled={background}
                      onClick={() => changePage(page)}
                      aria-label={`Ir para a página ${page}`}
                      aria-current={safePage === page ? "page" : undefined}
                      className={`flex h-9 w-9 items-center justify-center rounded border text-xs font-bold transition ${
                        safePage === page
                          ? "border-[#D9944E] bg-[#D9944E] text-[#120D0B]"
                          : "border-[#493023] text-[#D9C5B3] hover:border-[#D9944E]"
                      } disabled:cursor-not-allowed`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    type="button"
                    disabled={background || safePage === totalPages}
                    onClick={() => changePage(safePage + 1)}
                    aria-label="Próxima página"
                    className="flex h-9 w-9 items-center justify-center rounded border border-[#493023] text-[#D9C5B3] transition hover:border-[#D9944E] disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <ChevronRight size={15} />
                  </button>
                </nav>
              )}

              {/* BANNERS DESKTOP */}
              {!background && (
                <div className="mt-10 hidden lg:block">
                  <PromotionalBanners />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* BANNERS MOBILE E DIÁRIO */}
        {!background && (
          <>
            <div className="mt-10 lg:hidden">
              <PromotionalBanners />
            </div>

            <MintingJournal />
          </>
        )}
      </main>

      {!background && <Footer />}
    </div>
  );
}

import { api } from "../services/api";
import { useQuery } from "@tanstack/react-query";
import { NFTCard } from "./NFTCard";

import type { NFT, NFTListResponse } from "../types/nft";

const FEATURED_IDS = ["3", "6", "8"];

async function fetchFeaturedNFTs(): Promise<NFT[]> {
  const { data } = await api.get<NFTListResponse>(
    "/nfts?page=1&sort=newest&network=all",
  );

  if (!Array.isArray(data.items)) {
    throw new Error("Resposta inválida da API.");
  }

  const totalPages = Math.ceil(data.total / (data.pageSize || 6));

  const remainingPages = await Promise.all(
    Array.from({ length: Math.max(0, totalPages - 1) }, async (_, index) => {
      const { data: pageData } = await api.get<NFTListResponse>(
        `/nfts?page=${index + 2}&sort=newest&network=all`,
      );

      if (!Array.isArray(pageData.items)) {
        throw new Error("Resposta inválida da API.");
      }

      return pageData.items;
    }),
  );

  const allNFTs = [...data.items, ...remainingPages.flat()];

  return FEATURED_IDS.map((id) => allNFTs.find((nft) => nft.id === id)).filter(
    (nft): nft is NFT => nft !== undefined,
  );
}
export function FeaturedNFTs() {
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["featured-nfts"],
    queryFn: fetchFeaturedNFTs,
    staleTime: 60_000,
  });

  return (
    <section className="mt-16 border-t border-[#38251C] pt-12 md:mt-20 md:pt-16">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#D9944E]">
            Seleção especial
          </p>

          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            NFTs em destaque
          </h2>

          <p className="mt-3 max-w-xl text-sm text-gray-400">
            Explore algumas das peças mais interessantes da coleção Kurio.
          </p>
        </div>

        <a
          href="#marketplace"
          className="inline-flex w-fit items-center rounded-lg border border-[#D9944E] px-5 py-2.5 text-sm font-semibold text-[#D9944E] transition hover:bg-[#D9944E] hover:text-[#120D0B]"
        >
          Explorar marketplace
        </a>
      </div>

      {isPending && (
        <div
          role="status"
          className="rounded-xl border border-[#38251C] bg-[#211712] p-8 text-center text-gray-400"
        >
          Carregando destaques...
        </div>
      )}

      {isError && (
        <div className="rounded-xl border border-[#38251C] bg-[#211712] p-8 text-center">
          <p className="text-gray-400">
            Não foi possível carregar os destaques.
          </p>

          <button
            type="button"
            onClick={() => void refetch()}
            className="mt-4 rounded-lg bg-[#D9944E] px-5 py-2.5 font-semibold text-[#120D0B]"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {data && data.length > 0 && (
        <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-5 lg:grid-cols-3">
          {data.map((nft) => (
            <NFTCard key={nft.id} nft={nft} />
          ))}
        </div>
      )}
    </section>
  );
}

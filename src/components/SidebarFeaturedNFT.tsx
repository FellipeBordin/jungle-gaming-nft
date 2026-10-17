import { api } from "../services/api";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import type { NFT } from "../types/nft";

const FEATURED_NFT_ID = "4";

async function fetchFeaturedNFT(): Promise<NFT> {
  const { data: nft } = await api.get<NFT>(`/nfts/${FEATURED_NFT_ID}`);

  if (!nft || nft.id !== FEATURED_NFT_ID) {
    throw new Error("NFT em destaque inválido.");
  }

  return nft;
}

export function SidebarFeaturedNFT() {
  const {
    data: nft,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["sidebar-featured-nft", FEATURED_NFT_ID],
    queryFn: fetchFeaturedNFT,
    staleTime: 60_000,
  });

  return (
    <section
      aria-label="NFT em destaque"
      className="mt-4 overflow-hidden rounded-lg bg-[#211712] p-2"
    >
      <div className="px-2 pt-3 pb-2 text-center">
        <h3 className="font-mono text-sm font-extrabold uppercase tracking-wide text-[#D9944E]">
          NFT EM DESTAQUE
        </h3>

        <p className="mt-2 font-mono text-xs font-bold uppercase tracking-wide text-white">
          OFERTA LIMITADA
        </p>
      </div>

      {isPending && (
        <div
          role="status"
          className="flex aspect-square items-center justify-center rounded-lg bg-[#120D0B] text-center text-sm text-gray-400"
        >
          Carregando destaque...
        </div>
      )}

      {isError && (
        <div
          role="alert"
          className="flex aspect-square items-center justify-center rounded-lg bg-[#120D0B] text-center text-sm text-gray-400"
        >
          Destaque indisponível.
        </div>
      )}

      {nft && (
        <Link
          to="/nft/$nftId"
          params={{ nftId: nft.id }}
          aria-label={`Ver detalhes de ${nft.name}`}
          className="group block overflow-hidden rounded-lg"
        >
          <img
            src={nft.imageUrl}
            alt={nft.name}
            loading="lazy"
            className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
      )}
    </section>
  );
}

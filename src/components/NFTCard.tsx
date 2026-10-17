import { Link } from "@tanstack/react-router";
import type { NFT } from "../types/nft";

interface NFTCardProps {
  nft: NFT;
}

export function NFTCard({ nft }: NFTCardProps) {
  return (
    <article className="group min-w-0">
      <Link
        to="/nft/$nftId"
        params={{ nftId: nft.id }}
        className="block rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D9944E]"
      >
        {/* IMAGEM DO NFT */}
        <div className="aspect-square overflow-hidden rounded-xl bg-[#211712] shadow-[0_12px_30px_rgba(0,0,0,0.65)] ring-1 ring-[#6B4634]/40">
          <img
            src={nft.imageUrl}
            alt={`Arte digital ${nft.name}`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* INFORMAÇÕES */}
        <div className="px-1 pt-2">
          <h3 className="truncate font-mono text-xs font-semibold text-white transition-colors group-hover:text-[#D9944E]">
            {nft.name}
          </h3>

          <p className="mt-1 font-mono text-xs font-bold text-[#D9944E]">
            {Number(nft.priceEth).toFixed(2)} ETH
          </p>
        </div>
      </Link>
    </article>
  );
}

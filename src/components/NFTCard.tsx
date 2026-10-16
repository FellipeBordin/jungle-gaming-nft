
import { Link } from '@tanstack/react-router'
import type { NFT } from '../types/nft'

interface NFTCardProps {
  nft: NFT
}

export function NFTCard({ nft }: NFTCardProps) {
  return (
    <article className="group min-w-0">
      <Link
        to="/nft/$nftId"
        params={{ nftId: nft.id }}
        className="block rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D9944E]"
      >
        {/* IMAGEM DO NFT */}
        <div className="relative aspect-square overflow-hidden rounded-xl bg-[#302018]">
          <img
            src={nft.imageUrl}
            alt={`Arte digital ${nft.name}`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* INDICADOR DE EDIÇÃO LIMITADA */}
          {nft.available <= 5 && (
            <span className="absolute left-2 top-2 rounded bg-[#D9944E] px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-[#120D0B]">
              Limitado
            </span>
          )}
        </div>

        {/* INFORMAÇÕES */}
        <div className="pt-3">
          <h3 className="truncate text-sm font-semibold text-white transition-colors group-hover:text-[#D9944E] sm:text-base">
            {nft.name}
          </h3>

          <p className="mt-1 text-sm font-medium text-[#D9944E]">
            {nft.priceEth} ETH
          </p>
        </div>
      </Link>
    </article>
  )
}

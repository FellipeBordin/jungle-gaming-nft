import { useState } from "react";
import type { NFT } from "../types/nft";

export type NFTCategory = "all" | NFT["collection"];

type Network = "all" | "ethereum" | "polygon" | "solana";
type Sort = "newest" | "price_asc" | "price_desc";

interface MarketplaceFiltersProps {
  network: Network;
  sort: Sort;
  category: NFTCategory;
  minPrice: string;
  maxPrice: string;
  onNetworkChange: (network: Network) => void;
  onSortChange: (sort: Sort) => void;
  onCategoryChange: (category: NFTCategory) => void;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
  onClear: () => void;
  disabled?: boolean;
  nfts: NFT[];
}

const MAX_PRICE = 12.3;
const STEP = 0.05;

// Categorias adicionais do Figma: visíveis, mas sem filtro até existirem na API.
const availableCategories = ["Arte digital", "Colecionáveis"] as const;
const visualCategories = [
  "Arte digital",
  "Fotografia",
  "Música",
  "Arte 3D",
  "Colecionáveis",
  "Generativa",
  "Jogos",
  "Assinaturas",
  "Utilidade",
] as const;

const networks = [
  { value: "ethereum", label: "Ethereum" },
  { value: "polygon", label: "Polygon" },
  { value: "solana", label: "Solana" },
] as const;

function formatEth(value: number) {
  return value.toFixed(2);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function MarketplaceFilters({
  network,
  sort,
  category,
  minPrice,
  maxPrice,
  onNetworkChange,
  onSortChange,
  onCategoryChange,
  onMinPriceChange,
  onMaxPriceChange,
  onClear,
  disabled = false,
  nfts,
}: MarketplaceFiltersProps) {
  const [draftMin, setDraftMin] = useState(() =>
    minPrice === "" ? 0 : Number(minPrice),
  );
  const [draftMax, setDraftMax] = useState(() =>
    maxPrice === "" ? MAX_PRICE : Number(maxPrice),
  );

  const safeMin = clamp(Number.isFinite(draftMin) ? draftMin : 0, 0, MAX_PRICE);
  const safeMax = clamp(
    Number.isFinite(draftMax) ? draftMax : MAX_PRICE,
    safeMin,
    MAX_PRICE,
  );
  const minPercent = (safeMin / MAX_PRICE) * 100;
  const maxPercent = (safeMax / MAX_PRICE) * 100;

  const categoryCounts = {
    "Arte digital": nfts.filter((nft) => nft.collection === "Arte digital")
      .length,
    Colecionáveis: nfts.filter((nft) => nft.collection === "Colecionáveis")
      .length,
  };

  const networkCounts = {
    ethereum: nfts.filter((nft) => nft.network === "ethereum").length,
    polygon: nfts.filter((nft) => nft.network === "polygon").length,
    solana: nfts.filter((nft) => nft.network === "solana").length,
  };

  function applyPrice() {
    if (disabled) return;
    onMinPriceChange(safeMin === 0 ? "" : formatEth(safeMin));
    onMaxPriceChange(safeMax === MAX_PRICE ? "" : formatEth(safeMax));
  }

  function clearAllFilters() {
    if (disabled) return;
    setDraftMin(0);
    setDraftMax(MAX_PRICE);
    onClear();
  }

  function renderFilters(prefix: string) {
    return (
      <div className="space-y-7">
        <fieldset disabled={disabled}>
          <legend className="sr-only">Selecionar coleção</legend>
          <div className="space-y-0.5">
            <label
              className={`flex items-center justify-between gap-2 rounded px-2 py-2 text-xs transition ${category === "all" ? "bg-[#38251C] font-semibold text-[#D9944E]" : "text-[#C5B6AA] hover:bg-[#38251C]"}`}
            >
              <span className="flex items-center gap-2">
                <input
                  type="radio"
                  name={`${prefix}-category`}
                  checked={category === "all"}
                  onChange={() => onCategoryChange("all")}
                  className="accent-[#D9944E]"
                />
                Todas as coleções
              </span>
              <span className="text-[#9E8C7F]">({nfts.length})</span>
            </label>

            {visualCategories.map((name) => {
              const available = (
                availableCategories as readonly string[]
              ).includes(name);
              const count = available
                ? categoryCounts[name as keyof typeof categoryCounts]
                : 0;
              const selected = category === name;

              return (
                <label
                  key={name}
                  title={
                    !available ? "Categoria ainda não disponível" : undefined
                  }
                  className={`flex items-center justify-between gap-2 rounded px-2 py-2 text-xs transition ${
                    !available
                      ? "cursor-not-allowed text-[#796D65]"
                      : selected
                        ? "cursor-pointer bg-[#38251C] font-semibold text-[#D9944E]"
                        : "cursor-pointer text-[#C5B6AA] hover:bg-[#38251C] hover:text-white"
                  }`}
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <input
                      type="radio"
                      name={`${prefix}-category`}
                      checked={selected}
                      disabled={disabled || !available}
                      onChange={() => onCategoryChange(name as NFTCategory)}
                      className="accent-[#D9944E]"
                    />
                    <span>{name}</span>
                  </span>
                  <span className="shrink-0 text-[#9E8C7F]">({count})</span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <fieldset
          disabled={disabled}
          className="border-t border-[#38251C] pt-5"
        >
          <legend className="sr-only">Faixa de preço</legend>
          <h4 className="mb-4 text-sm font-bold text-white">Faixa de preço</h4>
          <div className="mb-3 flex justify-between text-xs text-[#C5B6AA]">
            <span>{formatEth(safeMin)} ETH</span>
            <span>{formatEth(safeMax)} ETH</span>
          </div>
          <div className="relative h-8">
            <div className="absolute top-3.5 h-1 w-full rounded-full bg-[#493023]" />
            <div
              className="absolute top-3.5 h-1 rounded-full bg-[#D9944E]"
              style={{
                left: `${minPercent}%`,
                width: `${Math.max(maxPercent - minPercent, 0)}%`,
              }}
            />
            <input
              type="range"
              min={0}
              max={MAX_PRICE}
              step={STEP}
              value={safeMin}
              aria-label="Preço mínimo em ETH"
              onChange={(event) =>
                setDraftMin(Math.min(Number(event.target.value), safeMax))
              }
              className="pointer-events-none absolute inset-x-0 top-1 h-6 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#D9944E] [&::-webkit-slider-thumb]:bg-[#211712] [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#D9944E] [&::-moz-range-thumb]:bg-[#211712]"
              style={{ zIndex: safeMin >= MAX_PRICE - STEP ? 5 : 3 }}
            />
            <input
              type="range"
              min={0}
              max={MAX_PRICE}
              step={STEP}
              value={safeMax}
              aria-label="Preço máximo em ETH"
              onChange={(event) =>
                setDraftMax(Math.max(Number(event.target.value), safeMin))
              }
              className="pointer-events-none absolute inset-x-0 top-1 h-6 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#D9944E] [&::-webkit-slider-thumb]:bg-[#211712] [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#D9944E] [&::-moz-range-thumb]:bg-[#211712]"
              style={{ zIndex: 4 }}
            />
          </div>
          <button
            type="button"
            onClick={applyPrice}
            disabled={disabled}
            className="mt-3 w-full rounded-md border border-[#D9944E] px-4 py-2 text-xs font-bold text-[#D9944E] transition hover:bg-[#D9944E] hover:text-[#120D0B] disabled:opacity-50"
          >
            Aplicar
          </button>
        </fieldset>

        <fieldset
          disabled={disabled}
          className="border-t border-[#38251C] pt-5"
        >
          <legend className="mb-3 text-sm font-bold text-white">Rede</legend>
          <div className="space-y-0.5">
            <label
              className={`flex items-center justify-between rounded px-2 py-2 text-xs ${network === "all" ? "bg-[#38251C] font-semibold text-[#D9944E]" : "text-[#C5B6AA]"}`}
            >
              <span className="flex items-center gap-2">
                <input
                  type="radio"
                  name={`${prefix}-network`}
                  checked={network === "all"}
                  onChange={() => onNetworkChange("all")}
                  className="accent-[#D9944E]"
                />
                Todas as redes
              </span>
              <span className="text-[#9E8C7F]">({nfts.length})</span>
            </label>
            {networks.map((option) => (
              <label
                key={option.value}
                className={`flex cursor-pointer items-center justify-between rounded px-2 py-2 text-xs transition ${network === option.value ? "bg-[#38251C] font-semibold text-[#D9944E]" : "text-[#C5B6AA] hover:bg-[#38251C] hover:text-white"}`}
              >
                <span className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`${prefix}-network`}
                    checked={network === option.value}
                    onChange={() => onNetworkChange(option.value)}
                    className="accent-[#D9944E]"
                  />
                  {option.label}
                </span>
                <span className="text-[#9E8C7F]">
                  ({networkCounts[option.value]})
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="border-t border-[#38251C] pt-5">
          <label
            htmlFor={`${prefix}-sort`}
            className="mb-2 block text-sm font-bold text-white"
          >
            Ordenar por
          </label>
          <select
            id={`${prefix}-sort`}
            value={sort}
            disabled={disabled}
            onChange={(event) => onSortChange(event.target.value as Sort)}
            className="w-full rounded-md border border-[#493023] bg-[#120D0B] px-3 py-2.5 text-xs text-white outline-none focus:border-[#D9944E] disabled:opacity-50"
          >
            <option value="newest">Listados recentemente</option>
            <option value="price_asc">Menor preço</option>
            <option value="price_desc">Maior preço</option>
          </select>
        </div>

        <button
          type="button"
          disabled={disabled}
          onClick={clearAllFilters}
          className="w-full rounded-md bg-[#D9944E] px-4 py-2.5 text-xs font-bold text-[#120D0B] transition hover:bg-[#E9A963] disabled:opacity-50"
        >
          Limpar filtros
        </button>
      </div>
    );
  }

  return (
    <>
      <aside className="hidden rounded-xl border border-[#38251C] bg-[#211712] p-5 lg:block">
        <h3 className="mb-5 text-lg font-bold text-white">Coleções</h3>
        {renderFilters("desktop")}
      </aside>

      <details className="rounded-xl border border-[#38251C] bg-[#211712] lg:hidden">
        <summary className="cursor-pointer px-5 py-4 text-sm font-semibold text-white">
          Coleções e filtros
        </summary>
        <div className="border-t border-[#38251C] p-5">
          {renderFilters("mobile")}
        </div>
      </details>
    </>
  );
}

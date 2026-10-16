
interface MarketplaceFiltersProps {
  network: 'all' | 'ethereum' | 'polygon' | 'solana'
  sort: 'newest' | 'price_asc' | 'price_desc'
  onNetworkChange: (
    network: MarketplaceFiltersProps['network']
  ) => void
  onSortChange: (
    sort: MarketplaceFiltersProps['sort']
  ) => void
  onClear: () => void
}

export function MarketplaceFilters({
  network,
  sort,
  onNetworkChange,
  onSortChange,
  onClear,
}: MarketplaceFiltersProps) {
  return (
    <aside className="rounded-xl border border-[#38251C] bg-[#211712] p-5">
      <h3 className="mb-6 text-lg font-bold text-white">
        Filtros
      </h3>

      <div className="space-y-6">
        <div>
          <label
            htmlFor="network-filter"
            className="mb-2 block text-sm text-gray-400"
          >
            Rede
          </label>

          <select
            id="network-filter"
            value={network}
            onChange={(event) =>
              onNetworkChange(
                event.target.value as MarketplaceFiltersProps['network']
              )
            }
            className="w-full rounded-lg border border-[#38251C] bg-[#120D0B] px-3 py-3 text-white outline-none focus:border-[#D9944E]"
          >
            <option value="all">Todas as redes</option>
            <option value="ethereum">Ethereum</option>
            <option value="polygon">Polygon</option>
            <option value="solana">Solana</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="sort-filter"
            className="mb-2 block text-sm text-gray-400"
          >
            Ordenar por
          </label>

          <select
            id="sort-filter"
            value={sort}
            onChange={(event) =>
              onSortChange(
                event.target.value as MarketplaceFiltersProps['sort']
              )
            }
            className="w-full rounded-lg border border-[#38251C] bg-[#120D0B] px-3 py-3 text-white outline-none focus:border-[#D9944E]"
          >
            <option value="newest">Mais recentes</option>
            <option value="price_asc">Menor preço</option>
            <option value="price_desc">Maior preço</option>
          </select>
        </div>

        <button
          type="button"
          onClick={onClear}
          className="w-full rounded-lg bg-[#D9944E] px-4 py-3 font-semibold text-[#120D0B] transition hover:bg-[#E9A963]"
        >
          Limpar filtros
        </button>
      </div>
    </aside>
  )
}

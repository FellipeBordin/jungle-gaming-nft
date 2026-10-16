
import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from '@tanstack/react-router'

import { Header } from './Header'
import { NFTCard } from './NFTCard'
import { MarketplaceFilters } from './MarketplaceFilters'
import { useNFTs } from '../hooks/useNFTs'

export interface MarketplaceSearch {
  search: string
  page: number
  network: 'all' | 'ethereum' | 'polygon' | 'solana'
  sort: 'newest' | 'price_asc' | 'price_desc'
}

interface MarketplaceContentProps {
  filters: MarketplaceSearch
  background?: boolean
}

export const defaultMarketplaceSearch: MarketplaceSearch = {
  search: '',
  page: 1,
  network: 'all',
  sort: 'newest',
}

export function MarketplaceContent({
  filters,
  background = false,
}: MarketplaceContentProps) {
  const navigate = useNavigate()
  const [searchInput, setSearchInput] = useState(filters.search)

  const { data, isPending, isError, refetch } = useNFTs(filters)

  useEffect(() => {
    setSearchInput(filters.search)
  }, [filters.search])

  const totalPages = data
    ? Math.ceil(data.total / data.pageSize)
    : 0

  function updateFilters(next: MarketplaceSearch) {
    if (background) return

    void navigate({
      to: '/',
      search: next,
    })
  }

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    updateFilters({
      ...filters,
      search: searchInput.trim(),
      page: 1,
    })
  }

  function changePage(page: number) {
    updateFilters({
      ...filters,
      page,
    })
  }

  function changeNetwork(network: MarketplaceSearch['network']) {
    updateFilters({
      ...filters,
      network,
      page: 1,
    })
  }

  function changeSort(sort: MarketplaceSearch['sort']) {
    updateFilters({
      ...filters,
      sort,
      page: 1,
    })
  }

  function clearFilters() {
    setSearchInput('')
    updateFilters(defaultMarketplaceSearch)
  }

  return (
    <div className="min-h-screen bg-[#120D0B] text-white">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
    
{/* HERO / BANNER PRINCIPAL */}
<section className="relative overflow-hidden rounded-2xl border border-[#493023] bg-[#291A14]">
  <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-[#D9944E]/10 blur-3xl" />

  <div className="relative grid grid-cols-[1.15fr_0.85fr] items-center gap-2 px-5 py-7 sm:gap-6 sm:px-8 sm:py-10 md:min-h-[360px] md:grid-cols-2 md:px-12 lg:px-16">

    {/* TEXTO */}
    <div className="relative z-10">
      <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#D9944E] sm:text-xs">
        Descubra a Kurio
      </p>

      <h1 className="max-w-xl text-xl font-extrabold leading-tight text-white sm:text-3xl md:text-4xl lg:text-5xl">
        SEJA DONO DO
        <span className="block text-[#D9944E]">
          FUTURO DA ARTE
        </span>
        DIGITAL
      </h1>

      <p className="mt-3 hidden max-w-md text-sm leading-relaxed text-gray-300 sm:block md:mt-5 md:text-base">
        Descubra NFTs exclusivos e explore uma nova
        forma de colecionar arte digital.
      </p>

      <a
        href="#marketplace"
        tabIndex={background ? -1 : undefined}
        className="mt-5 inline-flex items-center justify-center rounded-lg bg-[#D9944E] px-4 py-2.5 text-xs font-bold text-[#120D0B] transition hover:bg-[#E9A963] sm:px-6 sm:py-3 sm:text-sm md:mt-7"
      >
        EXPLORAR
      </a>
    </div>

    {/* IMAGEM */}
    <div className="relative flex h-full min-h-[155px] items-center justify-center sm:min-h-[240px] md:min-h-[320px]">
      <div className="absolute h-[85%] w-[85%] rounded-full bg-[#D9944E]/15 blur-3xl" />

      <img
        src="/nfts/ape-green.png"
        alt="NFT de macaco em destaque no marketplace Kurio"
        className="relative z-10 max-h-[190px] w-full object-contain drop-shadow-[0_18px_30px_rgba(0,0,0,0.45)] sm:max-h-[280px] md:max-h-[360px]"
      />
    </div>
  </div>
</section>
j

        {/* MARKETPLACE */}
        <section id="marketplace" className="mt-10 scroll-mt-24 md:mt-16">
          <p className="mb-2 text-sm uppercase tracking-widest text-[#D9944E]">
            Marketplace
          </p>

          <h2 className="text-3xl font-bold">
            Todos os NFTs
          </h2>

          <p className="mt-3 text-gray-400">
            Explore nossa coleção de NFTs.
          </p>

          {/* BUSCA */}
          <form
            onSubmit={handleSearch}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <label htmlFor="nft-search" className="sr-only">
              Buscar NFTs
            </label>

            <input
              id="nft-search"
              type="search"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Buscar NFTs..."
              disabled={background}
              className="min-w-0 flex-1 rounded-lg border border-[#38251C] bg-[#211712] px-4 py-3 text-white outline-none placeholder:text-gray-500 focus:border-[#D9944E]"
            />

            <button
              type="submit"
              disabled={background}
              className="rounded-lg bg-[#D9944E] px-8 py-3 font-semibold text-[#120D0B] hover:bg-[#E9A963]"
            >
              Buscar
            </button>
          </form>

          {/* FILTROS + CATÁLOGO */}
          <div className="mt-8 grid items-start gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
            <MarketplaceFilters
              network={filters.network}
              sort={filters.sort}
              onNetworkChange={changeNetwork}
              onSortChange={changeSort}
              onClear={clearFilters}
            />

            <div className="min-w-0">
              {data && (
                <p className="mb-5 text-sm text-gray-400">
                  {data.total}{' '}
                  {data.total === 1
                    ? 'NFT encontrado'
                    : 'NFTs encontrados'}
                </p>
              )}

              {isPending && (
                <div
                  role="status"
                  className="rounded-xl border border-[#38251C] bg-[#211712] p-8 text-center text-gray-400"
                >
                  Carregando NFTs...
                </div>
              )}

              {isError && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-900 bg-[#211712] p-8 text-center"
                >
                  <p className="text-red-400">
                    Não foi possível carregar os NFTs.
                  </p>

                  {!background && (
                    <button
                      type="button"
                      onClick={() => void refetch()}
                      className="mt-4 rounded-lg bg-[#D9944E] px-6 py-3 font-semibold text-[#120D0B]"
                    >
                      Tentar novamente
                    </button>
                  )}
                </div>
              )}

              {data && data.items.length === 0 && (
                <div className="rounded-xl border border-[#38251C] bg-[#211712] p-10 text-center">
                  <h3 className="text-xl font-semibold">
                    Nenhum NFT encontrado
                  </h3>

                  <p className="mt-3 text-gray-400">
                    Tente alterar a busca ou os filtros.
                  </p>

                  {!background && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="mt-5 rounded-lg bg-[#D9944E] px-6 py-3 font-semibold text-[#120D0B]"
                    >
                      Limpar filtros
                    </button>
                  )}
                </div>
              )}

              {data && data.items.length > 0 && (
                <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-5 lg:grid-cols-3">
                  {data.items.map((nft) => (
                    <NFTCard key={nft.id} nft={nft} />
                  ))}
                </div>
              )}

              {data && totalPages > 1 && (
                <nav
                  aria-label="Paginação dos NFTs"
                  className="mt-10 flex flex-wrap items-center justify-center gap-4"
                >
                  <button
                    type="button"
                    disabled={background || filters.page <= 1}
                    onClick={() => changePage(filters.page - 1)}
                    className="rounded-lg border border-[#38251C] bg-[#211712] px-5 py-3 disabled:opacity-40"
                  >
                    Anterior
                  </button>

                  <span className="text-sm text-gray-300">
                    Página {filters.page} de {totalPages}
                  </span>

                  <button
                    type="button"
                    disabled={background || filters.page >= totalPages}
                    onClick={() => changePage(filters.page + 1)}
                    className="rounded-lg border border-[#38251C] bg-[#211712] px-5 py-3 disabled:opacity-40"
                  >
                    Próxima
                  </button>
                </nav>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

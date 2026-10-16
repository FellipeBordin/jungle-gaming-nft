
import { useState } from 'react'
import {
  Heart,
  House,
  Compass,
  ShoppingCart,
  UserRound,
  X,
} from 'lucide-react'
import {
  Link,
  useNavigate,
  useRouterState,
} from '@tanstack/react-router'

import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'

const homeSearch = {
  search: '',
  page: 1,
  network: 'all' as const,
  sort: 'newest' as const,
}

export function MobileNavigation() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { totalItems } = useCart()

  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  const [showFavoritesInfo, setShowFavoritesInfo] =
    useState(false)

  function goToMarketplace() {
    void navigate({
      to: '/',
      search: homeSearch,
      hash: 'marketplace',
    })
  }

  function goToProfile() {
    void navigate({
      to: user ? '/profile' : '/login',
    })
  }

  const isHome = pathname === '/'
  const isCart = pathname === '/cart'
  const isProfile =
    pathname === '/profile' ||
    pathname === '/login' ||
    pathname === '/register'

  return (
    <>
      {/* AVISO TEMPORÁRIO DE FAVORITOS */}
      {showFavoritesInfo && (
        <div className="fixed inset-x-4 bottom-24 z-[60] rounded-xl border border-[#694331] bg-[#211712] p-4 text-white shadow-xl md:hidden">
          <button
            type="button"
            onClick={() => setShowFavoritesInfo(false)}
            aria-label="Fechar aviso"
            className="absolute right-3 top-3 text-gray-400"
          >
            <X size={18} />
          </button>

          <p className="pr-6 font-semibold text-[#D9944E]">
            Lista de interesses
          </p>

          <p className="mt-2 text-sm text-gray-300">
            Em breve você poderá salvar seus NFTs favoritos
            e encontrá-los aqui.
          </p>
        </div>
      )}

      {/* BARRA INFERIOR MOBILE */}
      <nav
        aria-label="Navegação mobile"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-[#38251C] bg-[#211712]/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_30px_rgba(0,0,0,0.35)] backdrop-blur-md md:hidden"
      >
        <div className="mx-auto grid h-16 max-w-md grid-cols-5 items-center">

          {/* INÍCIO */}
          <Link
            to="/"
            search={homeSearch}
            aria-label="Início"
            aria-current={isHome ? 'page' : undefined}
            className={`flex h-full flex-col items-center justify-center gap-1 ${
              isHome
                ? 'text-[#D9944E]'
                : 'text-gray-400'
            }`}
          >
            <House size={21} />
            <span className="text-[10px]">Início</span>
          </Link>

          {/* FAVORITOS */}
          <button
            type="button"
            onClick={() =>
              setShowFavoritesInfo((previous) => !previous)
            }
            aria-label="Lista de interesses"
            className="flex h-full flex-col items-center justify-center gap-1 text-gray-400 hover:text-[#D9944E]"
          >
            <Heart size={21} />
            <span className="text-[10px]">Favoritos</span>
          </button>

          {/* EXPLORAR */}
          <button
            type="button"
            onClick={goToMarketplace}
            aria-label="Explorar NFTs"
            className="flex h-full flex-col items-center justify-center gap-1 text-gray-400 hover:text-[#D9944E]"
          >
            <Compass size={22} />
            <span className="text-[10px]">Explorar</span>
          </button>

          {/* CARRINHO */}
          <Link
            to="/cart"
            aria-label={`Carrinho com ${totalItems} itens`}
            aria-current={isCart ? 'page' : undefined}
            className={`relative flex h-full flex-col items-center justify-center gap-1 ${
              isCart
                ? 'text-[#D9944E]'
                : 'text-gray-400'
            }`}
          >
            <div className="relative">
              <ShoppingCart size={21} />

              {totalItems > 0 && (
                <span className="absolute -right-3 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#D9944E] px-1 text-[9px] font-bold text-[#120D0B]">
                  {totalItems}
                </span>
              )}
            </div>

            <span className="text-[10px]">Carrinho</span>
          </Link>

          {/* PERFIL */}
          <button
            type="button"
            onClick={goToProfile}
            aria-label="Meu perfil"
            aria-current={isProfile ? 'page' : undefined}
            className={`flex h-full flex-col items-center justify-center gap-1 ${
              isProfile
                ? 'text-[#D9944E]'
                : 'text-gray-400'
            }`}
          >
            <UserRound size={21} />
            <span className="text-[10px]">Perfil</span>
          </button>
        </div>
      </nav>
    </>
  )
}

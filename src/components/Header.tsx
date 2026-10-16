
import {
  Search,
  ShoppingCart,
  LogOut,
  UserRound,
} from 'lucide-react'

import {
  Link,
  useNavigate,
} from '@tanstack/react-router'

import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'
import { MobileNavigation } from './MobileNavigation'

const homeSearch = {
  search: '',
  page: 1,
  network: 'all' as const,
  sort: 'newest' as const,
}

export function Header() {
  const { user, logout, isLoading } = useAuth()
  const { totalItems } = useCart()
  const navigate = useNavigate()

  function goToMarketplace() {
    void navigate({
      to: '/',
      search: homeSearch,
      hash: 'marketplace',
    })
  }

  function handleLogout() {
    logout()

    void navigate({
      to: '/',
      search: homeSearch,
    })
  }

  return (
    <>
      <header className="relative z-30 border-b border-[#38251C] bg-[#120D0B]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">

          {/* LOGO */}
          <Link
            to="/"
            search={homeSearch}
            className="text-xl font-bold tracking-[0.25em] text-white"
          >
            KURIO
          </Link>

          {/* MENU DESKTOP */}
          <nav
            aria-label="Navegação principal"
            className="hidden items-center gap-8 md:flex"
          >
            <Link
              to="/"
              search={homeSearch}
              className="text-sm text-[#D9944E]"
            >
              Início
            </Link>

            <Link
              to="/"
              search={homeSearch}
              hash="marketplace"
              className="text-sm text-gray-300 transition hover:text-[#D9944E]"
            >
              Mercado
            </Link>

            <Link
              to="/"
              search={homeSearch}
              hash="criadores"
              className="text-sm text-gray-300 transition hover:text-[#D9944E]"
            >
              Criadores
            </Link>

            <Link
              to="/"
              search={homeSearch}
              hash="aprenda"
              className="text-sm text-gray-300 transition hover:text-[#D9944E]"
            >
              Aprenda
            </Link>
          </nav>

          {/* AÇÕES DESKTOP */}
          <div className="hidden items-center gap-5 md:flex">
            <button
              type="button"
              onClick={goToMarketplace}
              aria-label="Buscar NFTs"
              className="text-gray-300 transition hover:text-[#D9944E]"
            >
              <Search size={19} />
            </button>

            <Link
              to="/cart"
              aria-label={`Carrinho com ${totalItems} itens`}
              className="relative text-gray-300 transition hover:text-[#D9944E]"
            >
              <ShoppingCart size={20} />

              {totalItems > 0 && (
                <span className="absolute -right-3 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#D9944E] px-1 text-[9px] font-bold text-[#120D0B]">
                  {totalItems}
                </span>
              )}
            </Link>

            {isLoading ? (
              <span className="text-xs text-gray-400">
                Carregando...
              </span>
            ) : user ? (
              <>
                <Link
                  to="/profile"
                  aria-label="Minha conta"
                  title={user.name}
                  className="flex items-center gap-2 text-sm text-gray-300 transition hover:text-[#D9944E]"
                >
                  <UserRound size={19} />
                  <span className="hidden lg:inline">
                    Minha conta
                  </span>
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  aria-label="Sair da conta"
                  className="text-gray-300 transition hover:text-[#D9944E]"
                >
                  <LogOut size={19} />
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="rounded bg-[#D9944E] px-4 py-2 text-sm font-semibold text-[#120D0B] transition hover:bg-[#E9A963]"
              >
                Entrar
              </Link>
            )}
          </div>

          {/* AÇÕES MOBILE */}
          <div className="flex items-center gap-4 md:hidden">
            <button
              type="button"
              onClick={goToMarketplace}
              aria-label="Buscar NFTs"
              className="text-gray-300"
            >
              <Search size={21} />
            </button>

            <Link
              to="/cart"
              aria-label="Abrir carrinho"
              className="relative text-gray-300"
            >
              <ShoppingCart size={21} />

              {totalItems > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#D9944E] px-1 text-[9px] font-bold text-[#120D0B]">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      <MobileNavigation />
    </>
  )
}

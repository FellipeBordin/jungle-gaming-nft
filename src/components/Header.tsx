import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  Search,
  ShoppingCart,
  LogOut,
  UserRound,
  X,
  SlidersHorizontal,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";

import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";
import { MobileNavigation } from "./MobileNavigation";

const homeSearch = {
  search: "",
  page: 1,
  network: "all" as const,
  sort: "newest" as const,
  category: "all" as const,
  minPrice: "",
  maxPrice: "",
};

export function Header() {
  const { user, logout, isLoading } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === "/";

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) searchInputRef.current?.focus();
  }, [isSearchOpen]);

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const search = searchTerm.trim();
    setIsSearchOpen(false);

    void navigate({
      to: "/",
      search: { ...homeSearch, search },
      hash: "marketplace",
    });
  }

  function handleLogout() {
    logout();
    void navigate({ to: "/", search: homeSearch });
  }

  return (
    <>
      {/* CABEÇALHO DESKTOP */}
      <header className="relative z-30 hidden border-b border-[#38251C] bg-[#120D0B] md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 lg:px-8">
          <Link
            to="/"
            search={homeSearch}
            className="font-mono text-xl font-bold tracking-[0.25em] text-white"
          >
            KURIO
          </Link>

          <nav
            aria-label="Navegação principal"
            className="flex items-center gap-8"
          >
            <Link
              to="/"
              search={homeSearch}
              className="font-mono text-sm text-gray-300 transition hover:text-[#D9944E]"
            >
              Início
            </Link>

            <Link
              to="/"
              search={homeSearch}
              hash="marketplace"
              className="font-mono text-sm text-[#D9944E]"
            >
              Mercado
            </Link>

            <Link
              to="/"
              search={homeSearch}
              hash="criadores"
              className="font-mono text-sm text-gray-300 transition hover:text-[#D9944E]"
            >
              Criadores
            </Link>

            <Link
              to="/"
              search={homeSearch}
              hash="aprenda"
              className="font-mono text-sm text-gray-300 transition hover:text-[#D9944E]"
            >
              Aprenda
            </Link>
          </nav>

          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={() => setIsSearchOpen((open) => !open)}
              aria-label={isSearchOpen ? "Fechar busca" : "Buscar NFTs"}
              aria-expanded={isSearchOpen}
              aria-controls="header-search"
              className="text-gray-300 transition hover:text-[#D9944E]"
            >
              {isSearchOpen ? <X size={19} /> : <Search size={19} />}
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
              <span className="text-xs text-gray-400">Carregando...</span>
            ) : user ? (
              <>
                <Link
                  to="/profile"
                  aria-label="Minha conta"
                  title={user.name}
                  className="flex items-center gap-2 text-sm text-gray-300 transition hover:text-[#D9944E]"
                >
                  <UserRound size={19} />
                  <span className="hidden lg:inline">Minha conta</span>
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
                className="rounded bg-[#D9944E] px-4 py-2 font-mono text-sm font-semibold text-[#120D0B] transition hover:bg-[#E9A963]"
              >
                Entrar
              </Link>
            )}
          </div>
        </div>

        {isSearchOpen && (
          <div
            id="header-search"
            className="border-t border-[#38251C] bg-[#1B130F]"
          >
            <form
              onSubmit={submitSearch}
              className="mx-auto flex max-w-7xl items-center gap-3 px-6 py-3 lg:px-8"
            >
              <Search size={19} className="shrink-0 text-[#D9944E]" />

              <label htmlFor="header-search-input" className="sr-only">
                Buscar NFTs pelo nome
              </label>

              <input
                ref={searchInputRef}
                id="header-search-input"
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Escape") setIsSearchOpen(false);
                }}
                placeholder="Buscar NFTs..."
                className="min-w-0 flex-1 bg-transparent py-2 text-sm text-white outline-none placeholder:text-gray-500"
              />

              <button
                type="submit"
                className="rounded-md bg-[#D9944E] px-4 py-2 text-sm font-semibold text-[#120D0B]"
              >
                Buscar
              </button>
            </form>
          </div>
        )}
      </header>

      {/* BUSCA MOBILE - SOMENTE HOME */}
      {isHome && (
        <div className="px-4 pt-4 md:hidden">
          <form onSubmit={submitSearch} className="flex items-center gap-2">
            <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg bg-[#2B1B16] px-3 py-3">
              <Search size={16} className="shrink-0 text-[#D9944E]" />

              <label htmlFor="mobile-home-search" className="sr-only">
                Explorar coleções
              </label>

              <input
                id="mobile-home-search"
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Explorar coleções"
                className="w-full min-w-0 bg-transparent font-mono text-xs text-white outline-none placeholder:text-[#C6A27F]"
              />
            </div>

            <button
              type="button"
              aria-label="Ir para os filtros do marketplace"
              onClick={() => {
                void navigate({
                  to: "/",
                  search: homeSearch,
                  hash: "marketplace",
                });
              }}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#D9944E] text-[#120D0B]"
            >
              <SlidersHorizontal size={19} />
            </button>
          </form>
        </div>
      )}

      <MobileNavigation />
    </>
  );
}

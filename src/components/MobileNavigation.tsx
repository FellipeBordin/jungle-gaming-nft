import { useState } from "react";
import {
  Heart,
  House,
  Compass,
  ShoppingCart,
  UserRound,
  X,
} from "lucide-react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";

import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";

const homeSearch = {
  search: "",
  page: 1,
  network: "all" as const,
  sort: "newest" as const,
  category: "all" as const,
  minPrice: "",
  maxPrice: "",
};

export function MobileNavigation() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { totalItems } = useCart();

  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  const [showFavoritesInfo, setShowFavoritesInfo] = useState(false);

  const isHome = pathname === "/";
  const isCart = pathname === "/cart";
  const isProfile = pathname === "/profile";

  // Telas com navegação própria no Figma
  const hideNavigation =
    pathname === "/cart" ||
    pathname === "/checkout" ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname.startsWith("/nft/");

  function goToMarketplace() {
    void navigate({
      to: "/",
      search: homeSearch,
      hash: "marketplace",
    });
  }

  function goToProfile() {
    void navigate({
      to: user ? "/profile" : "/login",
    });
  }

  if (hideNavigation) return null;

  return (
    <>
      {/* AVISO TEMPORÁRIO DE FAVORITOS */}
      {showFavoritesInfo && (
        <div
          role="status"
          className="fixed inset-x-4 bottom-24 z-50 mx-auto max-w-sm rounded-xl border border-[#694331] bg-[#211712] p-4 text-white shadow-xl md:hidden"
        >
          <button
            type="button"
            onClick={() => setShowFavoritesInfo(false)}
            aria-label="Fechar aviso"
            className="absolute right-3 top-3 text-gray-400"
          >
            <X size={18} />
          </button>

          <p className="pr-6 font-mono text-sm font-semibold text-[#D9944E]">
            Lista de interesses
          </p>

          <p className="mt-2 font-mono text-xs leading-relaxed text-[#BFA28D]">
            Em breve você poderá salvar seus NFTs favoritos e encontrá-los aqui.
          </p>
        </div>
      )}

      {/* NAVEGAÇÃO INFERIOR MOBILE */}
      <nav
        aria-label="Navegação mobile"
        className="fixed inset-x-3 bottom-3 z-40 mx-auto max-w-sm rounded-2xl border border-[#38251C] bg-[#211712]/95 px-3 pb-[env(safe-area-inset-bottom)] shadow-[0_8px_30px_rgba(0,0,0,0.5)] backdrop-blur-md md:hidden"
      >
        <div className="grid h-14 grid-cols-5 items-center">
          {/* INÍCIO */}
          <Link
            to="/"
            search={homeSearch}
            aria-label="Início"
            aria-current={isHome ? "page" : undefined}
            className={`flex h-11 items-center justify-center rounded-xl transition ${
              isHome ? "text-[#D9944E]" : "text-[#BFA28D] hover:text-[#D9944E]"
            }`}
          >
            <House size={20} fill={isHome ? "currentColor" : "none"} />
          </Link>

          {/* FAVORITOS */}
          <button
            type="button"
            onClick={() => setShowFavoritesInfo((previous) => !previous)}
            aria-label="Lista de interesses"
            className="flex h-11 items-center justify-center rounded-xl text-[#BFA28D] transition hover:text-[#D9944E]"
          >
            <Heart size={20} />
          </button>

          {/* EXPLORAR */}
          <button
            type="button"
            onClick={goToMarketplace}
            aria-label="Explorar NFTs"
            className="flex h-11 items-center justify-center rounded-xl text-[#BFA28D] transition hover:text-[#D9944E]"
          >
            <Compass size={22} />
          </button>

          {/* CARRINHO */}
          <Link
            to="/cart"
            aria-label={`Carrinho com ${totalItems} itens`}
            aria-current={isCart ? "page" : undefined}
            className={`relative flex h-11 items-center justify-center rounded-xl transition ${
              isCart ? "text-[#D9944E]" : "text-[#BFA28D] hover:text-[#D9944E]"
            }`}
          >
            <ShoppingCart size={20} />

            {totalItems > 0 && (
              <span className="absolute right-1 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#D9944E] px-1 text-[9px] font-bold text-[#120D0B]">
                {totalItems}
              </span>
            )}
          </Link>

          {/* PERFIL */}
          <button
            type="button"
            onClick={goToProfile}
            aria-label="Meu perfil"
            aria-current={isProfile ? "page" : undefined}
            className={`flex h-11 items-center justify-center rounded-xl transition ${
              isProfile
                ? "text-[#D9944E]"
                : "text-[#BFA28D] hover:text-[#D9944E]"
            }`}
          >
            <UserRound size={20} />
          </button>
        </div>
      </nav>
    </>
  );
}

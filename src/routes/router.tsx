import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
} from "@tanstack/react-router";

import { Home } from "../pages/Home";
import { NFTDetails } from "../pages/NFTDetails";
import { Cart } from "../pages/Cart";
import { Checkout } from "../pages/Checkout";
import { Login } from "../pages/Login";
import { Register } from "../pages/Register";
import { Profile } from "../pages/Profile";

// ROTA PRINCIPAL
const rootRoute = createRootRoute({
  component: () => <Outlet />,

  notFoundComponent: () => (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#120D0B] text-white">
      <h1 className="text-4xl font-bold text-[#D9944E]">404</h1>

      <p className="mt-4">Página não encontrada.</p>

      <a
        href="/"
        className="mt-6 rounded bg-[#D9944E] px-6 py-3 font-semibold text-black"
      >
        Voltar ao início
      </a>
    </main>
  ),
});

// ROTA HOME
const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",

  validateSearch: (search: Record<string, unknown>) => {
    const network =
      search.network === "ethereum" ||
      search.network === "polygon" ||
      search.network === "solana"
        ? search.network
        : "all";

    const sort =
      search.sort === "price_asc" || search.sort === "price_desc"
        ? search.sort
        : "newest";

    return {
      category:
        search.category === "Arte digital" ||
        search.category === "Colecionáveis"
          ? search.category
          : "all",

      minPrice:
        typeof search.minPrice === "string" &&
        search.minPrice !== "" &&
        Number.isFinite(Number(search.minPrice)) &&
        Number(search.minPrice) >= 0
          ? search.minPrice
          : "",

      maxPrice:
        typeof search.maxPrice === "string" &&
        search.maxPrice !== "" &&
        Number.isFinite(Number(search.maxPrice)) &&
        Number(search.maxPrice) >= 0
          ? search.maxPrice
          : "",
      search: typeof search.search === "string" ? search.search : "",

      page:
        typeof search.page === "number" &&
        Number.isInteger(search.page) &&
        search.page > 0
          ? search.page
          : 1,

      network: network as "all" | "ethereum" | "polygon" | "solana",

      sort: sort as "newest" | "price_asc" | "price_desc",
    };
  },

  component: Home,
});

const nftDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/nft/$nftId",
  component: NFTDetails,
});

const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/cart",
  component: Cart,
});

const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/checkout",
  component: Checkout,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: Login,
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register",
  component: Register,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: Profile,
});

// ÁRVORE DE ROTAS
const routeTree = rootRoute.addChildren([
  homeRoute,
  nftDetailsRoute,
  cartRoute,
  checkoutRoute,
  loginRoute,
  registerRoute,
  profileRoute,
]);

// INSTÂNCIA DO ROUTER
export const router = createRouter({
  routeTree,
});

// TIPAGEM DO TANSTACK ROUTER
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

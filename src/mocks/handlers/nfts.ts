import { http, HttpResponse } from "msw";
import { nftFixtures } from "../fixtures";

export const nftHandlers = [
  // LISTAGEM DE NFTs
  http.get("/api/nfts", ({ request }) => {
    const url = new URL(request.url);

    const search = (url.searchParams.get("search") ?? "").trim().toLowerCase();

    const network = url.searchParams.get("network") ?? "all";
    const sort = url.searchParams.get("sort") ?? "newest";

    const page = Math.max(1, Number(url.searchParams.get("page")) || 1);

    const pageSize = 6;

    let filtered = nftFixtures.filter((nft) => {
      const matchesSearch = nft.name.toLowerCase().includes(search);

      const matchesNetwork = network === "all" || nft.network === network;

      return matchesSearch && matchesNetwork;
    });

    filtered = [...filtered].sort((a, b) => {
      if (sort === "price_asc") {
        return Number(a.priceEth) - Number(b.priceEth);
      }

      if (sort === "price_desc") {
        return Number(b.priceEth) - Number(a.priceEth);
      }

      return Number(b.id) - Number(a.id);
    });

    const start = (page - 1) * pageSize;

    return HttpResponse.json({
      items: filtered.slice(start, start + pageSize),
      total: filtered.length,
      page,
      pageSize,
    });
  }),

  // DETALHES DE UM NFT PELO ID
  http.get("/api/nfts/:id", ({ params }) => {
    const { id } = params;

    const nft = nftFixtures.find((item) => item.id === id);

    if (!nft) {
      return HttpResponse.json(
        { message: "NFT não encontrado" },
        { status: 404 },
      );
    }

    return HttpResponse.json(nft);
  }),
];

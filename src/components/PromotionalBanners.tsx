import { Link } from "@tanstack/react-router";

const banners = [
  {
    title: "Lançamentos gênesis de edição limitada",
    description:
      "Colecione edições especiais diretamente dos criadores antes da revelação pública.",
    image: "/nfts/ape-green.png",
    imageAlt: "NFT de macaco com jaqueta verde",
  },
  {
    title: "Arte digital selecionada e muito mais",
    description:
      "Explore novos artistas, coleções verificadas e obras digitais que definem a cultura.",
    image: "/nfts/ape-blue.png",
    imageAlt: "NFT de macaco com roupa social",
  },
];

export function PromotionalBanners() {
  return (
    <section
      aria-label="Coleções em destaque"
      className="grid grid-cols-1 gap-5 md:grid-cols-2"
    >
      {banners.map((banner) => (
        <article
          key={banner.title}
          className="grid min-h-40 grid-cols-[43%_57%] overflow-hidden rounded-lg bg-[#211712]"
        >
          {/* IMAGEM À ESQUERDA */}
          <div className="min-w-0 overflow-hidden">
            <img
              src={banner.image}
              alt={banner.imageAlt}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>

          {/* TEXTO À DIREITA */}
          <div className="flex min-w-0 flex-col items-center justify-center px-3 py-4 text-center sm:px-5">
            <h2 className="max-w-55 font-mono text-[11px] leading-snug font-bold text-white sm:text-sm">
              {banner.title}
            </h2>

            <p className="mt-2 max-w-60 font-mono text-[9px] leading-relaxed text-[#D5C3B4] sm:text-[10px]">
              {banner.description}
            </p>

            <Link
              to="/"
              search={{
                search: "",
                page: 1,
                network: "all",
                sort: "newest",
                category: "all",
                minPrice: "",
                maxPrice: "",
              }}
              hash="marketplace"
              className="mt-3 inline-flex items-center justify-center rounded-sm bg-[#D9944E] px-4 py-1.5 font-mono text-[10px] font-bold text-[#120D0B] transition hover:bg-[#E9A963]"
            >
              Explorar →
            </Link>
          </div>
        </article>
      ))}
    </section>
  );
}

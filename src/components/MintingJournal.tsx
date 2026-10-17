const articles = [
  {
    id: 1,
    title: "Como funciona a propriedade de NFTs",
    description: "Aprenda a colecionar, negociar e verificar ativos digitais.",
    image: "/nfts/ape-blue.png",
    date: "12 de setembro",
    readingTime: "6 min",
  },
  {
    id: 2,
    title: "10 artistas digitais para acompanhar",
    description: "Conheça criadores que moldam a cultura digital.",
    image: "/nfts/ape-green.png",
    date: "13 de setembro",
    readingTime: "2 min",
  },
  {
    id: 3,
    title: "Raridade, atributos e procedência",
    description:
      "Entenda raridade, procedência, direitos autorais e utilidade.",
    image: "/nfts/ape-purple.png",
    date: "15 de setembro",
    readingTime: "3 min",
  },
  {
    id: 4,
    title: "Como proteger sua carteira",
    description: "Proteja sua carteira, seus ativos e sua identidade.",
    image: "/nfts/ape-gold.png",
    date: "15 de setembro",
    readingTime: "2 min",
  },
];

export function MintingJournal() {
  return (
    <section aria-labelledby="minting-journal-title" className="mt-16">
      {/* CABEÇALHO */}
      <div className="mb-7 text-center">
        <h2
          id="minting-journal-title"
          className="font-mono text-2xl font-extrabold text-white"
        >
          Diário da Cunhagem
        </h2>

        <p className="mx-auto mt-2 max-w-2xl font-mono text-xs leading-relaxed text-[#BFA28D]">
          Histórias, guias e insights para colecionadores sobre o universo da
          propriedade digital.
        </p>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {articles.map((article) => (
          <article
            key={article.id}
            className="group flex h-full flex-col overflow-hidden rounded-md bg-[#241510]"
          >
            {/* IMAGEM */}
            <div className="aspect-4/3 overflow-hidden bg-[#E7E4C7]">
              <img
                src={article.image}
                alt={`Ilustração do artigo: ${article.title}`}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            {/* CONTEÚDO */}
            <div className="flex flex-1 flex-col px-3 py-3">
              <p className="font-mono text-[10px] text-[#C6A27F]">
                {article.date} | Leitura de {article.readingTime}
              </p>

              <h3 className="mt-2 font-mono text-sm font-bold leading-snug text-white">
                {article.title}
              </h3>

              <p className="mt-2 font-mono text-[11px] leading-relaxed text-[#C6A27F]">
                {article.description}
              </p>

              <span className="mt-auto inline-block pt-3 font-mono text-[11px] font-semibold text-[#D9944E]">
                Ler mais →
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

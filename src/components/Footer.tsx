import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { Mail, Phone } from "lucide-react";

const marketplaceSearch = {
  search: "",
  page: 1,
  network: "all" as const,
  sort: "newest" as const,
};

const benefits = [
  {
    letter: "W",
    title: "Segurança da carteira",
    description: "Proteja sua carteira e colecione arte digital com confiança.",
  },
  {
    letter: "C",
    title: "Criadores em destaque",
    description:
      "Conheça artistas, estúdios e comunidades que moldam a cultura digital na rede.",
  },
  {
    letter: "D",
    title: "Alertas de lançamentos",
    description:
      "Receba calendários de cunhagem, novidades de listas de acesso e análises do mercado.",
  },
];

const profileLinks = [
  "Meu perfil",
  "Minha coleção",
  "Atividade",
  "Estúdio do criador",
  "Lista de interesses",
];

const helpLinks = [
  "Central de ajuda",
  "Como comprar NFTs",
  "Carteira e segurança",
  "Política do mercado",
  "Denunciar item",
];

const collectionLinks = [
  "Arte digital",
  "Fotografia",
  "Música",
  "Arte 3D",
  "Utilidade",
];

function SocialIcon({
  name,
  children,
}: {
  name: string;
  children: React.ReactNode;
}) {
  return (
    <span
      aria-label={name}
      title={`${name} — link indisponível nesta demonstração`}
      className="flex h-9 w-9 items-center justify-center rounded-md border border-[#D9944E] text-[#F1BD60]"
    >
      {children}
    </span>
  );
}

export function Footer() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim()) return;

    setSubmitted(true);
  }

  return (
    <footer id="footer" className="mt-20 bg-[#241510] font-mono text-white">
      {/* ÁREA SUPERIOR */}
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:px-8 lg:grid-cols-4 lg:gap-0 lg:px-10">
        {benefits.map((benefit) => (
          <div
            key={benefit.title}
            className="lg:border-r lg:border-[#D9944E] lg:px-7 lg:first:pl-0"
          >
            <div className="mb-4 flex h-19 w-19 items-center justify-center rounded-full bg-[#F3BF63] text-2xl font-bold text-[#49363D]">
              {benefit.letter}
            </div>

            <h3 className="mb-3 text-base font-bold">{benefit.title}</h3>

            <p className="max-w-xs text-sm leading-relaxed text-[#F0DEDA]">
              {benefit.description}
            </p>
          </div>
        ))}

        {/* NEWSLETTER */}
        <div className="lg:pl-7">
          <h3 className="mb-4 text-lg leading-tight font-bold">
            Antecipe-se ao próximo lançamento
          </h3>

          <form
            onSubmit={handleSubscribe}
            className="flex overflow-hidden rounded-md border border-[#D9944E]/50"
          >
            <label htmlFor="kurio-newsletter" className="sr-only">
              Digite seu e-mail
            </label>

            <input
              id="kurio-newsletter"
              type="email"
              required
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setSubmitted(false);
              }}
              placeholder="Digite seu e-mail..."
              className="min-w-0 flex-1 bg-[#432510] px-3 py-3 text-sm text-white outline-none placeholder:text-[#C7A88C]"
            />

            <button
              type="submit"
              className="bg-[#F3BF63] px-4 text-sm font-bold text-[#49363D] transition hover:bg-[#FFD084]"
            >
              Enviar
            </button>
          </form>

          <p className="mt-4 text-sm leading-relaxed text-[#F0DEDA]">
            Receba lançamentos selecionados, histórias de criadores e novidades
            do mercado.
          </p>

          {submitted && (
            <p role="status" className="mt-3 text-xs text-[#F3BF63]">
              E-mail validado. A inscrição estará disponível quando a newsletter
              for integrada.
            </p>
          )}
        </div>
      </div>

      {/* FAIXA LARANJA */}
      <div className="bg-[#38200F]">
        <div className="mx-auto grid max-w-7xl gap-5 px-5 py-6 text-sm font-semibold sm:px-8 md:grid-cols-2 lg:grid-cols-4 lg:items-center lg:px-10">
          <Link
            to="/"
            search={marketplaceSearch}
            className="text-xl font-black tracking-wider text-white"
          >
            KURIO
          </Link>

          <p className="max-w-xs">
            Feito para colecionadores, criadores e cultura
          </p>

          <div className="flex items-center gap-2">
            <Mail size={17} />
            <span>Contato indisponível</span>
          </div>

          <div className="flex items-center gap-2">
            <Phone size={17} />
            <span>Telefone não informado</span>
          </div>
        </div>
      </div>

      {/* NAVEGAÇÃO INFERIOR */}
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-6 gap-y-10 px-5 py-10 sm:px-8 lg:grid-cols-4 lg:px-10">
        <div>
          <h3 className="mb-5 text-lg font-bold">Meu perfil</h3>

          <ul className="space-y-3">
            {profileLinks.map((label) => (
              <li key={label}>
                {label === "Meu perfil" ? (
                  <Link
                    to="/profile"
                    className="text-sm text-[#F0DEDA] hover:text-[#F3BF63]"
                  >
                    {label}
                  </Link>
                ) : (
                  <span className="text-sm text-[#F0DEDA]">{label}</span>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-5 text-lg font-bold">Central de ajuda</h3>

          <ul className="space-y-3">
            {helpLinks.map((label) => (
              <li key={label} className="text-sm text-[#F0DEDA]">
                {label}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-5 text-lg font-bold">Coleções</h3>

          <ul className="space-y-3">
            {collectionLinks.map((label) => (
              <li key={label}>
                {label === "Arte digital" ? (
                  <a
                    href="/#marketplace"
                    className="text-sm text-[#F0DEDA] hover:text-[#F3BF63]"
                  >
                    {label}
                  </a>
                ) : (
                  <span className="text-sm text-[#F0DEDA]">{label}</span>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* REDES E CARTEIRAS */}
        <div>
          <h3 className="mb-5 text-lg font-bold">Redes sociais</h3>

          <div className="flex flex-wrap gap-2">
            <SocialIcon name="Facebook">
              <span className="text-lg font-black">f</span>
            </SocialIcon>

            <SocialIcon name="Instagram">
              <span className="text-sm font-bold">◎</span>
            </SocialIcon>

            <SocialIcon name="X">
              <span className="text-sm font-bold">𝕏</span>
            </SocialIcon>

            <SocialIcon name="LinkedIn">
              <span className="text-xs font-bold">in</span>
            </SocialIcon>

            <SocialIcon name="YouTube">
              <span className="text-xs font-bold">▶</span>
            </SocialIcon>
          </div>

          <h4 className="mt-7 mb-3 text-base font-bold">
            Carteiras compatíveis
          </h4>

          <div className="inline-flex flex-wrap items-center gap-2 rounded-md bg-[#B8793B] px-3 py-2 text-[10px] font-bold uppercase text-white">
            <span>MetaMask</span>
            <span>•</span>
            <span>WalletConnect</span>
            <span>•</span>
            <span>Coinbase</span>
          </div>

          <p className="mt-2 text-xs text-[#E0C9C5]">
            Referências visuais. Integração de carteira não implementada.
          </p>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="bg-[#120D0B] px-4 py-5 text-center">
        <p className="text-xs font-medium text-[#F0DEDA]">
          © {new Date().getFullYear()} Kurio. Propriedade digital para todos.
        </p>
      </div>
    </footer>
  );
}

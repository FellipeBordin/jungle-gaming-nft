import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  UserRound,
  Wallet,
  ShoppingCart,
  Heart,
  BadgePercent,
  Download,
  TriangleAlert,
  LogOut,
  Eye,
  EyeOff,
  Plus,
  Image as ImageIcon,
  CheckCircle2,
} from "lucide-react";
import { Header } from "../components/Header";
import { useAuth } from "../hooks/useAuth";
import type { AuthUser } from "../services/auth";
import { OrderHistory } from "../components/OrderHistory";

type Tab =
  | "profile"
  | "wallets"
  | "activity"
  | "wishlist"
  | "offers"
  | "downloads"
  | "support";
type WalletData = {
  displayName: string;
  nickname: string;
  network: string;
  profileName: string;
  address: string;
  secondaryAddress: string;
  type: string;
  referral: string;
  email: string;
  ens: string;
};
type ExtraProfile = {
  username: string;
  ens: string;
  nickname: string;
  displayName: string;
  email: string;
};
const emptyWallet: WalletData = {
  displayName: "",
  nickname: "",
  network: "",
  profileName: "",
  address: "",
  secondaryAddress: "",
  type: "",
  referral: "",
  email: "",
  ens: "",
};
const menu: { id: Tab; label: string; icon: typeof UserRound }[] = [
  { id: "profile", label: "Dados do perfil", icon: UserRound },
  { id: "wallets", label: "Carteiras", icon: Wallet },
  { id: "activity", label: "Atividade", icon: ShoppingCart },
  { id: "wishlist", label: "Lista de interesse", icon: Heart },
  { id: "offers", label: "Ofertas", icon: BadgePercent },
  { id: "downloads", label: "Arquivos baixados", icon: Download },
  { id: "support", label: "Suporte", icon: TriangleAlert },
];
const inputClass =
  "mt-2 w-full min-w-0 rounded-sm border border-[#3F2319] bg-transparent px-3 py-2.5 text-xs text-[#F5F1EB] outline-none placeholder:text-[#B39463] focus:border-[#D28A4C]";
const labelClass = "block min-w-0 text-xs text-[#F5F1EB]";
const buttonClass =
  "rounded-sm bg-[#D28A4C] px-6 py-2.5 text-xs font-bold text-[#1A100D] hover:bg-[#E9A763]";

function readStored<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback;
  } catch {
    return fallback;
  }
}

export function Profile() {
  const { user, isLoading, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) void navigate({ to: "/login", replace: true });
  }, [isLoading, user, navigate]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-[#140D0A] text-white">
        <Header />
        <p className="p-16 text-center text-[#B39463]">
          {isLoading
            ? "Carregando perfil..."
            : "Redirecionando para o login..."}
        </p>
      </div>
    );
  }

  return <ProfileContent key={user.id} user={user} logout={logout} />;
}

function ProfileContent({
  user,
  logout,
}: {
  user: AuthUser;
  logout: () => void;
}) {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("profile");
  const [profile, setProfile] = useState<ExtraProfile>(() =>
    readStored(`kurio_profile_${user.id}`, {
      username: "",
      ens: "",
      nickname: "",
      displayName: user.name,
      email: user.email,
    }),
  );
  const [wallet, setWallet] = useState<WalletData>(() =>
    readStored(`kurio_wallet_${user.id}`, emptyWallet),
  );
  const [secondaryWallet, setSecondaryWallet] = useState<WalletData>(() =>
    readStored(`kurio_wallet_secondary_${user.id}`, emptyWallet),
  );
  const [showSecondary, setShowSecondary] = useState(
    () =>
      localStorage.getItem(`kurio_wallet_secondary_enabled_${user.id}`) ===
      "true",
  );
  const [sameAsPrimary, setSameAsPrimary] = useState(
    () => localStorage.getItem(`kurio_wallet_same_${user.id}`) === "true",
  );
  const [message, setMessage] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);

  function switchTab(next: Tab) {
    setTab(next);
    setMessage("");
  }

  function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user) return;
    localStorage.setItem(`kurio_profile_${user.id}`, JSON.stringify(profile));
    setMessage(
      "Dados demonstrativos salvos neste navegador. A conta no servidor não foi alterada.",
    );
  }

  function saveWallet(event: FormEvent<HTMLFormElement>, secondary = false) {
    event.preventDefault();
    if (!user) return;
    const data = secondary ? secondaryWallet : wallet;
    if (
      !data.displayName.trim() ||
      !data.nickname.trim() ||
      !data.network ||
      !data.profileName.trim() ||
      !data.address.trim() ||
      !data.type ||
      !data.email.trim()
    ) {
      setMessage("Preencha os campos obrigatórios da carteira.");
      return;
    }
    localStorage.setItem(
      `kurio_wallet_${secondary ? "secondary_" : ""}${user.id}`,
      JSON.stringify(data),
    );
    setMessage(
      "Carteira demonstrativa salva neste navegador. Nenhuma conexão blockchain foi realizada.",
    );
  }

  function logoutUser() {
    logout();
    void navigate({
      to: "/",
      search: { search: "", page: 1, network: "all", sort: "newest" },
    });
  }

  const initials = user.name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
  const walletFields = (
    data: WalletData,
    update: (data: WalletData) => void,
  ) => {
    const field = (
      key: keyof WalletData,
      label: string,
      placeholder = "",
      required = false,
    ) => (
      <label className={labelClass} key={key}>
        {label}
        {required && <span className="text-[#D28A4C]"> *</span>}
        <input
          className={inputClass}
          value={data[key]}
          placeholder={placeholder}
          required={required}
          onChange={(e) => update({ ...data, [key]: e.target.value })}
        />
      </label>
    );
    return (
      <div className="grid min-w-0 grid-cols-1 gap-x-5 gap-y-5 lg:grid-cols-2">
        {field("displayName", "Nome de exibição", "", true)}
        {field("nickname", "Apelido da carteira", "", true)}
        <label className={labelClass}>
          Rede <span className="text-[#D28A4C]">*</span>
          <select
            className={inputClass}
            required
            value={data.network}
            onChange={(e) => update({ ...data, network: e.target.value })}
          >
            <option value="">Selecione uma rede</option>
            <option value="ethereum">Ethereum</option>
            <option value="polygon">Polygon</option>
            <option value="solana">Solana</option>
          </select>
        </label>
        {field("profileName", "Nome do perfil", "", true)}
        {field("address", "Endereço da carteira", "Endereço da carteira", true)}
        {field("secondaryAddress", "ENS ou carteira adicional", "Opcional")}
        <label className={labelClass}>
          Tipo de carteira <span className="text-[#D28A4C]">*</span>
          <select
            className={inputClass}
            required
            value={data.type}
            onChange={(e) => update({ ...data, type: e.target.value })}
          >
            <option value="">Selecione uma carteira</option>
            <option>WalletConnect</option>
            <option>MetaMask</option>
            <option>Coinbase Wallet</option>
          </select>
        </label>
        {field("referral", "Código de indicação", "Opcional")}
        {field("email", "E-mail", "", true)}
        {field("ens", "Nome ENS", "nome.eth")}
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#140D0A] text-[#F5F1EB]">
      <Header />
      <main className="mx-auto grid w-full min-w-0 max-w-[1180px] grid-cols-1 gap-5 px-4 pb-20 pt-6 md:grid-cols-[228px_minmax(0,1fr)] md:gap-6 md:px-6">
        <aside className="min-w-0 max-w-full self-start overflow-hidden bg-[#241612] md:sticky md:top-6">
          <h2 className="px-3 pb-2 pt-4 text-sm font-bold tracking-wide">
            Meu perfil
          </h2>
          <nav
            aria-label="Menu do perfil"
            className="grid grid-cols-2 gap-0 sm:grid-cols-3 md:block"
          >
            {menu.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => switchTab(id)}
                className={`flex min-w-0 items-center gap-2 border-l-4 px-2 py-3 text-left text-[11px] sm:text-xs md:w-full md:gap-3 md:px-3 ${tab === id ? "border-[#D28A4C] bg-[#301D17] text-[#D28A4C]" : "border-transparent text-[#D28A4C] hover:bg-[#301D17]"}`}
              >
                <Icon size={15} className="shrink-0" />
                <span className="min-w-0 break-words">{label}</span>
              </button>
            ))}
          </nav>
          <button
            type="button"
            onClick={logoutUser}
            className="flex w-full items-center gap-3 border-t border-[#503024] px-4 py-3 text-left text-xs text-[#D28A4C] hover:bg-[#301D17]"
          >
            <LogOut size={15} /> Sair
          </button>
        </aside>

        <section className="min-w-0 w-full max-w-full overflow-hidden pb-10">
          {message && (
            <p
              role="status"
              className="mb-5 rounded border border-[#855333] bg-[#2F1D15] px-4 py-3 text-xs text-[#E9B17A]"
            >
              {message}
            </p>
          )}

          {tab === "profile" && (
            <>
              <h1 className="mb-7 text-sm font-bold tracking-wide">
                Perfil do colecionador
              </h1>
              <form onSubmit={saveProfile} className="space-y-7">
                <div className="grid min-w-0 grid-cols-1 gap-x-5 gap-y-5 lg:grid-cols-2">
                  <label className={labelClass}>
                    Nome de exibição <span className="text-[#D28A4C]">*</span>
                    <input
                      className={inputClass}
                      required
                      value={profile.displayName}
                      onChange={(e) =>
                        setProfile({ ...profile, displayName: e.target.value })
                      }
                    />
                  </label>
                  <label className={labelClass}>
                    Nome de usuário <span className="text-[#D28A4C]">*</span>
                    <input
                      className={inputClass}
                      required
                      value={profile.username}
                      onChange={(e) =>
                        setProfile({ ...profile, username: e.target.value })
                      }
                    />
                  </label>
                  <label className={labelClass}>
                    E-mail <span className="text-[#D28A4C]">*</span>
                    <input
                      type="email"
                      className={inputClass}
                      required
                      value={profile.email}
                      onChange={(e) =>
                        setProfile({ ...profile, email: e.target.value })
                      }
                    />
                  </label>
                  <label className={labelClass}>
                    Nome ENS
                    <div className="flex min-w-0 gap-2">
                      <span className="mt-2 flex items-center border border-[#3F2319] px-2 text-xs text-[#B39463]">
                        .eth
                      </span>
                      <input
                        className={inputClass}
                        value={profile.ens}
                        onChange={(e) =>
                          setProfile({ ...profile, ens: e.target.value })
                        }
                      />
                    </div>
                  </label>
                  <label className={labelClass}>
                    Apelido da carteira
                    <input
                      className={inputClass}
                      value={profile.nickname}
                      onChange={(e) =>
                        setProfile({ ...profile, nickname: e.target.value })
                      }
                    />
                  </label>
                  <div>
                    <p className={labelClass}>Avatar</p>
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#3F2319] text-[#D28A4C]">
                        {initials || <ImageIcon size={19} />}
                      </div>
                      <button
                        type="button"
                        disabled
                        title="Upload de avatar não disponível nesta demonstração"
                        className={`${buttonClass} cursor-not-allowed opacity-60`}
                      >
                        Alterar
                      </button>
                      <button
                        type="button"
                        disabled
                        title="Avatar armazenado apenas como iniciais"
                        className="cursor-not-allowed text-xs opacity-60"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                </div>
                <div className="max-w-[310px] space-y-4">
                  <h2 className="text-sm font-bold">Alterar senha</h2>
                  {(
                    [
                      "Senha atual",
                      "Nova senha",
                      "Confirmar nova senha",
                    ] as const
                  ).map((label) => (
                    <label key={label} className={labelClass}>
                      {label}
                      <div className="relative">
                        <input
                          type={showPasswords ? "text" : "password"}
                          disabled
                          placeholder="Indisponível nesta demonstração"
                          className={`${inputClass} cursor-not-allowed pr-10 opacity-60`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords(!showPasswords)}
                          className="absolute right-3 top-1/2 translate-y-[-35%] text-[#B39463]"
                          aria-label={
                            showPasswords ? "Ocultar senhas" : "Mostrar senhas"
                          }
                        >
                          {showPasswords ? (
                            <Eye size={14} />
                          ) : (
                            <EyeOff size={14} />
                          )}
                        </button>
                      </div>
                    </label>
                  ))}
                  <p className="text-[11px] text-[#B39463]">
                    Alteração de senha requer um endpoint na API.
                  </p>
                </div>
                <button className={buttonClass} type="submit">
                  Salvar
                </button>
                <p className="text-[11px] text-[#B39463]">
                  As alterações desta seção são locais. Nome e e-mail da conta
                  no servidor permanecem os mesmos.
                </p>
              </form>
            </>
          )}

          {tab === "wallets" && (
            <div className="space-y-8">
              <div>
                <div className="flex items-center justify-between gap-3">
                  <h1 className="text-sm font-bold">Carteira principal</h1>
                  <span className="text-xs text-[#D28A4C]">Adicionar</span>
                </div>
                <p className="mt-1 text-[11px] text-[#B39463]">
                  Carteiras demonstrativas para organização do perfil; não são
                  conectadas à blockchain.
                </p>
              </div>
              <form onSubmit={(e) => saveWallet(e)} className="space-y-6">
                {walletFields(wallet, setWallet)}
                <button type="submit" className={buttonClass}>
                  Salvar carteira
                </button>
              </form>
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-sm font-bold">Carteira secundária</h2>
                  <div className="flex items-center gap-4 text-xs text-[#D28A4C]">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={sameAsPrimary}
                        onChange={(e) => {
                          setSameAsPrimary(e.target.checked);
                          localStorage.setItem(
                            `kurio_wallet_same_${user.id}`,
                            String(e.target.checked),
                          );
                          if (e.target.checked) setShowSecondary(false);
                        }}
                      />{" "}
                      Igual à principal
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setShowSecondary(true);
                        setSameAsPrimary(false);
                        localStorage.setItem(
                          `kurio_wallet_same_${user.id}`,
                          "false",
                        );
                        localStorage.setItem(
                          `kurio_wallet_secondary_enabled_${user.id}`,
                          "true",
                        );
                      }}
                      className="flex items-center gap-1"
                    >
                      <Plus size={14} /> Adicionar
                    </button>
                  </div>
                </div>
                {sameAsPrimary ? (
                  <p className="text-xs text-[#B39463]">
                    A carteira principal será usada como referência.
                  </p>
                ) : showSecondary ? (
                  <form
                    onSubmit={(e) => saveWallet(e, true)}
                    className="space-y-6"
                  >
                    {walletFields(secondaryWallet, setSecondaryWallet)}
                    <div className="flex gap-3">
                      <button type="submit" className={buttonClass}>
                        Salvar carteira secundária
                      </button>
                      <button
                        type="button"
                        className="text-xs text-[#D28A4C]"
                        onClick={() => {
                          setShowSecondary(false);
                          localStorage.setItem(
                            `kurio_wallet_secondary_enabled_${user.id}`,
                            "false",
                          );
                        }}
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                ) : (
                  <p className="text-[11px] text-[#B39463]">
                    Você ainda não adicionou uma carteira secundária.
                  </p>
                )}
              </div>
            </div>
          )}

          {tab === "activity" && (
            <div>
              <h1 className="mb-2 text-sm font-bold">Atividade</h1>
              <p className="mb-6 text-xs text-[#B39463]">
                Histórico de pedidos registrados no marketplace.
              </p>
              <div className="w-full min-w-0 max-w-full overflow-x-auto">
                <OrderHistory email={user.email} />
              </div>
            </div>
          )}

          {tab === "wishlist" && (
            <div>
              <h1 className="text-sm font-bold">Lista de interesse</h1>
              <div className="mt-8 rounded border border-[#3F2319] p-8 text-center">
                <Heart className="mx-auto mb-3 text-[#D28A4C]" size={28} />
                <p className="text-sm">
                  Sua lista de interesse ainda não está disponível.
                </p>
                <p className="mt-2 text-xs text-[#B39463]">
                  A integração com favoritos será implementada em uma próxima
                  etapa.
                </p>
                <Link
                  to="/"
                  search={{
                    search: "",
                    page: 1,
                    network: "all",
                    sort: "newest",
                  }}
                  className="mt-5 inline-block text-xs text-[#D28A4C]"
                >
                  Explorar NFTs
                </Link>
              </div>
            </div>
          )}

          {tab === "offers" && (
            <div>
              <h1 className="text-sm font-bold">Ofertas</h1>
              <div className="mt-8 rounded border border-[#3F2319] p-8 text-center">
                <BadgePercent
                  className="mx-auto mb-3 text-[#D28A4C]"
                  size={28}
                />
                <p className="text-sm">Nenhuma oferta disponível</p>
                <p className="mt-2 text-xs text-[#B39463]">
                  O envio e o recebimento de ofertas ainda não estão disponíveis
                  nesta demonstração.
                </p>
              </div>
            </div>
          )}

          {tab === "downloads" && (
            <div>
              <h1 className="text-sm font-bold">Arquivos baixados</h1>
              <div className="mt-8 rounded border border-[#3F2319] p-8 text-center">
                <Download className="mx-auto mb-3 text-[#D28A4C]" size={28} />
                <p className="text-sm">Nenhum arquivo disponível</p>
                <p className="mt-2 text-xs text-[#B39463]">
                  Não há arquivos de NFT para baixar nesta demonstração.
                </p>
              </div>
            </div>
          )}

          {tab === "support" && (
            <div>
              <h1 className="text-sm font-bold">Suporte</h1>
              <div className="mt-8 rounded border border-[#3F2319] p-8">
                <TriangleAlert className="mb-3 text-[#D28A4C]" size={26} />
                <h2 className="text-sm font-bold">Central de ajuda Kurio</h2>
                <p className="mt-3 text-xs leading-6 text-[#B39463]">
                  Este marketplace é uma demonstração. Pedidos, carteiras e NFTs
                  são simulados; nenhuma criptomoeda é transferida. O
                  atendimento e a abertura de chamados ainda não estão
                  integrados.
                </p>
                <p className="mt-4 flex items-center gap-2 text-xs text-[#D28A4C]">
                  <CheckCircle2 size={15} /> Você pode consultar suas compras em
                  Atividade.
                </p>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

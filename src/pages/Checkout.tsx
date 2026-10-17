import { useState, type FormEvent } from "react";

import { isAxiosError } from "axios";

import { Link, useNavigate } from "@tanstack/react-router";

import {
  ArrowLeft,
  ChevronDown,
  MoreVertical,
  ShieldCheck,
  Wallet,
} from "lucide-react";

import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";

import { useCreateOrder } from "../hooks/useCreateOrder";
import {
  OrderConfirmationModal,
  type ConfirmedOrder,
} from "../components/OrderConfirmationModal";

const marketplaceSearch = {
  search: "",

  page: 1,

  network: "all" as const,

  sort: "newest" as const,
};

const walletOptions = ["WalletConnect", "MetaMask", "Coinbase Wallet"] as const;

const fieldClass =
  "w-full min-w-0 rounded border border-[#503024] bg-[#140E0C] px-3 py-2.5 text-xs text-[#F1E4D8] outline-none placeholder:text-[#8C6D52] focus:border-[#D9944E]";

const labelClass = "mb-1.5 block text-[11px] font-medium text-[#EAD8C8]";

export function Checkout() {
  const navigate = useNavigate();

  const { user, isLoading } = useAuth();

  const { items, totalEth, clearCart } = useCart();

  const createOrder = useCreateOrder();

  const [confirmedOrder, setConfirmedOrder] = useState<ConfirmedOrder | null>(
    null,
  );

  const [name, setName] = useState("");

  const [username, setUsername] = useState("");

  const [profileName, setProfileName] = useState("");

  const [email, setEmail] = useState("");

  const [wallet, setWallet] = useState("");

  const [network, setNetwork] = useState("");

  const [walletType, setWalletType] = useState("");

  const [referralCode, setReferralCode] = useState("");

  const [ensName, setEnsName] = useState("");

  const [notes, setNotes] = useState("");

  const [useOtherWallet, setUseOtherWallet] = useState(false);

  const [selectedWallet, setSelectedWallet] = useState("");

  const [selectedAccount, setSelectedAccount] = useState<
    "reserva" | "principal" | ""
  >("");

  const [mobileDetailsOpen, setMobileDetailsOpen] = useState(false);

  const [error, setError] = useState("");

  async function submitOrder() {
    setError("");

    if (isLoading) {
      setError("Aguarde a verificação da sua sessão.");
      return;
    }

    if (!user) {
      await navigate({ to: "/login" });
      return;
    }

    if (!name.trim() || !email.trim() || !wallet.trim()) {
      setError(
        "Informe nome, e-mail e endereço da carteira para registrar o pedido.",
      );

      setMobileDetailsOpen(true);

      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Informe um e-mail válido.");

      setMobileDetailsOpen(true);

      return;
    }

    if (items.length === 0) {
      setError("Seu carrinho está vazio.");

      return;
    }

    try {
      const order = await createOrder.mutateAsync({
        name: name.trim(),
        email: email.trim(),
        wallet: wallet.trim(),
        items: items.map(({ nft, quantity }) => ({
          nftId: nft.id,
          quantity,
        })),
      });

      if (order.status === "pending") {
        setError(
          `Pedido ${order.id} recebido e aguardando confirmação. Acompanhe o status no histórico de pedidos.`,
        );
        return;
      }

      if (order.status === "rejected") {
        setError(
          `O pedido ${order.id} foi recusado. Nenhuma compra foi concluída.`,
        );
        return;
      }

      if (order.status !== "confirmed") {
        setError("Não foi possível verificar o status do pedido.");
        return;
      }

      // Só mostra o comprovante quando o pedido estiver confirmado.
      setConfirmedOrder({
        id: String(order.id),
        date: new Date(),
        items: items.map(({ nft, quantity }) => ({
          nft,
          quantity,
        })),
        totalEth,
        walletName: selectedWallet || walletType || "Não informada",
      });

      clearCart();
    } catch (err) {
      setError(
        isAxiosError(err) && typeof err.response?.data?.message === "string"
          ? err.response.data.message
          : "Não foi possível confirmar o pedido.",
      );
    }
  }

  function handleDesktopSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (
      !username.trim() ||
      !profileName.trim() ||
      !network ||
      !walletType ||
      !selectedWallet
    ) {
      setError("Preencha os campos obrigatórios e selecione uma carteira.");

      return;
    }

    void submitOrder();
  }

  type NewType = FormEvent<HTMLFormElement>;

  function handleMobileSubmit(event: NewType) {
    event.preventDefault();

    if (!selectedWallet || !selectedAccount) {
      setError("Selecione uma conta demonstrativa e uma opção de carteira.");

      return;
    }

    void submitOrder();
  }

  if (confirmedOrder) {
    return (
      <div className="min-h-screen bg-[#140D0A] text-[#F3EAE2]">
        <div className="hidden md:block">
          <Header />
        </div>
        <OrderConfirmationModal
          order={confirmedOrder}
          onClose={() => void navigate({ to: "/", search: marketplaceSearch })}
        />
      </div>
    );
  }

  if (items.length === 0)
    return (
      <div className="min-h-screen bg-[#140D0A] text-white">
        <div className="hidden md:block">
          <Header />
        </div>

        <main className="mx-auto max-w-3xl px-5 py-20 text-center">
          <Wallet size={42} className="mx-auto text-[#D9944E]" />

          <h1 className="mt-5 text-2xl font-bold">Seu carrinho está vazio</h1>

          <p className="mt-3 text-sm text-[#BFA28D]">
            Adicione NFTs antes de finalizar a compra.
          </p>

          <Link
            to="/"
            search={marketplaceSearch}
            className="mt-7 inline-block rounded-lg bg-[#D9944E] px-6 py-3 text-sm text-[#211712]"
          >
            Explorar NFTs
          </Link>
        </main>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#140D0A] text-[#F3EAE2]">
      <div className="hidden md:block">
        <Header />
      </div>

      {/* MOBILE: tela exclusiva de pagamento com carteira */}

      <main className="mx-auto min-h-dvh max-w-120 bg-[#140D0A] px-0 pb-0 pt-0 md:hidden">
        <form
          onSubmit={handleMobileSubmit}
          noValidate
          className="flex min-h-dvh flex-col rounded-[30px] bg-[#241612] px-5 pb-6 pt-7 sm:px-7"
        >
          <div className="relative flex items-center gap-4">
            <button
              type="button"
              onClick={() => void navigate({ to: "/cart" })}
              aria-label="Voltar ao carrinho"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#69453E] text-[#E7AA63]"
            >
              <ArrowLeft size={21} />
            </button>

            <h1 className="text-[19px] font-extrabold tracking-wide leading-tight">
              Pagamento com carteira
            </h1>
          </div>

          <div className="mt-8 flex items-center justify-between gap-2">
            <h2 className="text-sm font-bold">Carteira conectada</h2>

            <button
              type="button"
              onClick={() => {
                setSelectedAccount("");

                setWallet("");

                setMobileDetailsOpen(true);
              }}
              className="text-xs font-bold text-[#E8A34F]"
            >
              Trocar carteira
            </button>
          </div>

          <p className="mt-1 text-[10px] text-[#AE998E]">
            Contas ilustrativas — nenhuma carteira conectada de verdade.
          </p>

          <div className="mt-3 space-y-3">
            {(["reserva", "principal"] as const).map((account) => (
              <button
                key={account}
                type="button"
                onClick={() => setSelectedAccount(account)}
                aria-pressed={selectedAccount === account}
                className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-4 text-left ${selectedAccount === account ? "border-[#E4A451] bg-[#563832]" : "border-transparent bg-[#49302E]"}`}
              >
                <span
                  className={`h-4 w-4 shrink-0 rounded-full border-2 border-[#E8A34F] ${selectedAccount === account ? "bg-[#E8A34F] shadow-[inset_0_0_0_3px_#563832]" : ""}`}
                />

                <span className="flex-1">
                  <span className="block text-base font-extrabold">
                    {account === "reserva" ? "Reserva" : "Principal"}
                  </span>

                  <span className="mt-1 block text-xs text-[#F0E2D6]">
                    {account === "reserva"
                      ? "Conta demonstrativa · Polygon"
                      : "Conta demonstrativa · Ethereum"}
                  </span>
                </span>

                <MoreVertical size={19} className="text-[#E8A34F]" />
              </button>
            ))}
          </div>

          <h2 className="mb-3 mt-6 text-sm font-bold">Carteira e rede</h2>

          <div className="space-y-3">
            {walletOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  setSelectedWallet(option);

                  setWalletType(option);
                }}
                aria-pressed={selectedWallet === option}
                className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3.5 text-left ${selectedWallet === option ? "border-[#E4A451] bg-[#563832]" : "border-transparent bg-[#49302E]"}`}
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#D9944E] text-sm font-black text-[#4D2B23]">
                  {option === "Coinbase Wallet" ? "C" : "W"}
                </span>

                <span className="flex-1 text-sm font-bold">{option}</span>

                <span
                  className={`h-4 w-4 rounded-full border-2 border-[#E8A34F] ${selectedWallet === option ? "bg-[#E8A34F] shadow-[inset_0_0_0_3px_#563832]" : ""}`}
                />
              </button>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-end gap-4">
            <span className="text-sm font-bold">Total:</span>

            <span className="text-xl font-extrabold text-[#E8A34F]">
              {totalEth} ETH
            </span>
          </div>

          <div className="mt-5">
            <button
              type="button"
              onClick={() => setMobileDetailsOpen((open) => !open)}
              aria-expanded={mobileDetailsOpen}
              className="flex w-full items-center justify-between border-b border-[#60423C] pb-2 text-left text-xs text-[#D9C0AE]"
            >
              Dados necessários para registrar o pedido{" "}
              <ChevronDown
                size={17}
                className={mobileDetailsOpen ? "rotate-180" : ""}
              />
            </button>

            {mobileDetailsOpen && (
              <div className="mt-4 space-y-3">
                <div>
                  <label htmlFor="mobile-name" className={labelClass}>
                    Nome *
                  </label>

                  <input
                    id="mobile-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome"
                    className={fieldClass}
                  />
                </div>

                <div>
                  <label htmlFor="mobile-email" className={labelClass}>
                    E-mail *
                  </label>

                  <input
                    id="mobile-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seuemail@exemplo.com"
                    className={fieldClass}
                  />
                </div>

                <div>
                  <label htmlFor="mobile-wallet" className={labelClass}>
                    Endereço da carteira *
                  </label>

                  <input
                    id="mobile-wallet"
                    value={wallet}
                    onChange={(e) => setWallet(e.target.value)}
                    placeholder="Informe seu endereço de carteira"
                    className={fieldClass}
                  />
                </div>

                <p className="text-[10px] leading-4 text-[#BFA28D]">
                  A seleção acima é visual. Informe seus dados para registrar o
                  pedido demonstrativo.
                </p>
              </div>
            )}
          </div>

          {error && (
            <p
              role="alert"
              className="mt-4 rounded-lg border border-[#A56A43] bg-[#43251E] p-3 text-xs text-[#FFD09B]"
            >
              {error}
            </p>
          )}

          <div className="mt-auto pt-12">
            <button
              type="submit"
              disabled={createOrder.isPending || isLoading}
              className="w-full rounded-full bg-[#FFBF52] px-5 py-4 text-sm font-extrabold text-[#241711] disabled:opacity-50"
            >
              {createOrder.isPending
                ? "Processando pedido..."
                : "Confirmar compra"}
            </button>

            <p className="mt-3 text-center text-[10px] text-[#A88D79]">
              Checkout demonstrativo. Nenhuma transação real será realizada.
            </p>
          </div>
        </form>
      </main>

      {/* DESKTOP: formulário preservado */}

      <main className="mx-auto hidden max-w-6xl px-6 pb-16 pt-8 md:block">
        <div className="mb-6 flex items-center gap-2 text-[11px]">
          <Link to="/" search={marketplaceSearch}>
            Início
          </Link>

          <span>/</span>

          <Link to="/cart">Mercado</Link>

          <span>/</span>

          <span>Pagamento</span>
        </div>

        <form
          onSubmit={handleDesktopSubmit}
          className="grid items-start gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-12"
        >
          <section className="min-w-0">
            <h2 className="mb-4 text-sm font-bold">Perfil do colecionador</h2>

            <div className="grid gap-x-4 gap-y-4 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className={labelClass}>
                  Nome de exibição{" "}
                  <span className="text-base font-bold text-[#D9944E]">*</span>
                </label>

                <input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className={fieldClass}
                />
              </div>

              <div>
                <label htmlFor="username" className={labelClass}>
                  Nome de usuário{" "}
                  <span className="text-base font-bold text-[#D9944E]">*</span>
                </label>

                <input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className={fieldClass}
                />
              </div>

              <div>
                <label htmlFor="network" className={labelClass}>
                  Rede{" "}
                  <span className="text-base font-bold text-[#D9944E]">*</span>
                </label>

                <select
                  id="network"
                  value={network}
                  onChange={(e) => setNetwork(e.target.value)}
                  required
                  className={fieldClass}
                >
                  <option value="">Selecione uma rede</option>

                  <option value="ethereum">Ethereum</option>

                  <option value="polygon">Polygon</option>

                  <option value="solana">Solana</option>
                </select>
              </div>

              <div>
                <label htmlFor="profileName" className={labelClass}>
                  Nome do perfil{" "}
                  <span className="text-base font-bold text-[#D9944E]">*</span>
                </label>

                <input
                  id="profileName"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  required
                  className={fieldClass}
                />
              </div>

              <div>
                <label htmlFor="wallet" className={labelClass}>
                  Endereço da carteira{" "}
                  <span className="text-base font-bold text-[#D9944E]">*</span>
                </label>

                <input
                  id="wallet"
                  value={wallet}
                  onChange={(e) => setWallet(e.target.value)}
                  placeholder="Endereço 0x da carteira"
                  required
                  className={fieldClass}
                />
              </div>

              <div>
                <label htmlFor="secondaryWallet" className={labelClass}>
                  Carteira secundária (opcional)
                </label>

                <input
                  id="secondaryWallet"
                  placeholder="ENS ou carteira secundária"
                  className={fieldClass}
                />
              </div>

              <div>
                <label htmlFor="walletType" className={labelClass}>
                  Tipo de carteira{" "}
                  <span className="text-base font-bold text-[#D9944E]">*</span>
                </label>

                <select
                  id="walletType"
                  value={walletType}
                  onChange={(e) => setWalletType(e.target.value)}
                  required
                  className={fieldClass}
                >
                  <option value="">Selecione uma carteira</option>

                  {walletOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="referral" className={labelClass}>
                  Código de indicação
                </label>

                <input
                  id="referral"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                  className={fieldClass}
                />
              </div>

              <div>
                <label htmlFor="email" className={labelClass}>
                  E-mail{" "}
                  <span className="text-base font-bold text-[#D9944E]">*</span>
                </label>

                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={fieldClass}
                />
              </div>

              <div>
                <label htmlFor="ensName" className={labelClass}>
                  Nome ENS
                </label>

                <div className="flex gap-2">
                  <input
                    id="ensName"
                    value={ensName}
                    onChange={(e) => setEnsName(e.target.value)}
                    placeholder="nome"
                    className={fieldClass}
                  />

                  <span className="flex items-center rounded border border-[#503024] px-2 text-xs">
                    .eth
                  </span>
                </div>
              </div>
            </div>

            <label className="mt-5 flex items-center gap-2 text-xs">
              <input
                type="checkbox"
                checked={useOtherWallet}
                onChange={(e) => setUseOtherWallet(e.target.checked)}
                className="h-3.5 w-3.5 cursor-pointer appearance-none rounded-full border border-[#D9944E] bg-transparent checked:bg-[#D9944E]"
              />
              Usar outra carteira?
            </label>

            <div className="mt-5">
              <label htmlFor="notes" className={labelClass}>
                Observação do colecionador (opcional)
              </label>

              <textarea
                id="notes"
                rows={5}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className={`${fieldClass} resize-y`}
              />
            </div>
          </section>

          <aside className="min-w-0">
            <h2 className="text-sm font-bold">Seus NFTs</h2>

            <div className="mt-2 flex justify-between border-b border-[#503024] pb-2 text-[11px]">
              <span>NFTs</span>

              <span>Subtotal</span>
            </div>

            <div className="mt-2 space-y-2">
              {items.map(({ nft, quantity }) => (
                <div
                  key={nft.id}
                  className="flex items-center gap-3 bg-[#281915] p-2"
                >
                  <img
                    src={nft.imageUrl}
                    alt={nft.name}
                    className="h-12 w-12 shrink-0 rounded object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-bold">{nft.name}</p>

                    <p className="mt-1 text-[10px] text-[#B58D67]">
                      ID do token: #{nft.id} (× {quantity})
                    </p>
                  </div>

                  <span className="shrink-0 text-xs font-bold text-[#D9944E]">
                    {(
                      (Math.round(Number(nft.priceEth) * 100) * quantity) /
                      100
                    ).toFixed(2)}{" "}
                    ETH
                  </span>
                </div>
              ))}
            </div>

            <p className="mt-4 text-center text-[10px] text-[#C8A68C]">
              Tem um código promocional? Aplique aqui
            </p>

            <div className="mt-4 space-y-3 text-xs">
              <div className="flex justify-between">
                <span>Subtotal</span>

                <span>{totalEth} ETH</span>
              </div>

              <div className="flex justify-between">
                <span>Desconto do lançamento</span>

                <span>0.00 ETH</span>
              </div>

              <div className="flex justify-between">
                <span>Taxa de rede</span>

                <span>Não calculada</span>
              </div>

              <div className="border-b border-[#503024] pb-3 text-center text-[10px] text-[#D9944E]">
                Taxa estimada no Figma: 0.016 ETH
              </div>

              <div className="flex items-center justify-between pt-2 font-bold">
                <span>Total</span>

                <span className="text-sm text-[#D9944E]">{totalEth} ETH</span>
              </div>
            </div>

            <h3 className="mt-6 text-center text-xs font-bold">
              Carteira e rede
            </h3>

            <div className="mt-3 space-y-2">
              {walletOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    setSelectedWallet(option);

                    setWalletType(option);
                  }}
                  aria-pressed={selectedWallet === option}
                  className={`flex w-full items-center gap-2 border px-3 py-3 text-left text-xs ${selectedWallet === option ? "border-[#D9944E] bg-[#382219]" : "border-[#503024]"}`}
                >
                  <span
                    className={`h-3 w-3 rounded-full border border-[#D9944E] ${selectedWallet === option ? "bg-[#D9944E]" : ""}`}
                  />

                  {option}
                </button>
              ))}
            </div>

            {error && (
              <p
                role="alert"
                className="mt-5 rounded border border-[#865038] bg-[#382219] p-3 text-xs text-[#F2B16E]"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={createOrder.isPending || isLoading}
              className="mt-5 w-full rounded bg-[#D9944E] px-5 py-3 text-xs font-bold text-[#211712] transition hover:bg-[#E9A963] disabled:opacity-50"
            >
              {createOrder.isPending
                ? "Processando pedido..."
                : "Confirmar compra"}
            </button>

            <p className="mt-3 flex items-start gap-2 text-[10px] leading-5 text-[#BFA28D]">
              <ShieldCheck size={14} className="shrink-0" />
              Compra demonstrativa. Nenhuma transação real será realizada.
            </p>
          </aside>
        </form>
      </main>

      <div className="hidden md:block">
        <Footer />
      </div>
    </div>
  );
}

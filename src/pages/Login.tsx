import { useState, type FormEvent } from "react";
import { isAxiosError } from "axios";
import { Link, useNavigate } from "@tanstack/react-router";

import { AuthModal } from "../components/AuthModal";
import { useAuth } from "../hooks/useAuth";

export function Login() {
  const navigate = useNavigate();
  const { login, user } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await login({
        email: email.trim(),
        password,
      });

      await navigate({
        to: "/",
        search: {
          search: "",
          page: 1,
          network: "all",
          sort: "newest",
          category: "all",
          minPrice: "",
          maxPrice: "",
        },
      });
    } catch (err) {
      if (isAxiosError(err)) {
        setError(
          err.response?.data?.message ?? "Não foi possível realizar o login.",
        );
      } else {
        setError("Ocorreu um erro inesperado.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  if (user) {
    return (
      <AuthModal>
        <div className="py-16 text-center">
          <h1 className="text-2xl font-bold">Você já está conectado</h1>

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
            className="mt-6 inline-block text-[#D9944E]"
          >
            Voltar ao marketplace
          </Link>
        </div>
      </AuthModal>
    );
  }

  return (
    <AuthModal>
      <div className="mb-14 mt-12 text-center md:mb-8 md:mt-0">
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
          className="text-3xl font-black tracking-[0.2em] md:text-xl"
        >
          KURIO
        </Link>
      </div>

      <h1 className="mb-8 text-center text-2xl font-bold md:text-xl">Entrar</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="login-email" className="sr-only">
            E-mail
          </label>

          <input
            id="login-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="contato@email.com"
            required
            className="w-full rounded-lg border border-[#795B4D] bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-[#B8A49A] focus:border-[#D9944E]"
          />
        </div>

        <div className="relative">
          <label htmlFor="login-password" className="sr-only">
            Senha
          </label>

          <input
            id="login-password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Senha"
            required
            className="w-full rounded-lg border border-[#795B4D] bg-transparent px-4 py-3 pr-12 text-sm text-white outline-none placeholder:text-[#B8A49A] focus:border-[#D9944E]"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[#D9944E]"
          >
            {showPassword ? "Ocultar" : "Ver"}
          </button>
        </div>

        <div className="text-right">
          <button
            type="button"
            disabled
            title="Recuperação de senha indisponível nesta demonstração"
            className="cursor-not-allowed text-xs text-[#D9944E] opacity-60"
          >
            Esqueceu a senha?
          </button>
        </div>

        {error && (
          <p
            role="alert"
            className="rounded-lg border border-red-900 bg-red-950/30 p-3 text-sm text-red-300"
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-5 w-full rounded-lg bg-[#F2B654] px-6 py-3 font-bold text-[#211712] transition hover:bg-[#FFD080] disabled:opacity-50"
        >
          {isSubmitting ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <div className="my-8 flex items-center gap-3">
        <div className="h-px flex-1 bg-[#795B4D]" />
        <span className="text-xs text-gray-300">Ou continue com</span>
        <div className="h-px flex-1 bg-[#795B4D]" />
      </div>

      <div className="space-y-3">
        <button
          type="button"
          disabled
          title="Login com Google não disponível na demonstração"
          className="w-full cursor-not-allowed rounded-lg border border-[#795B4D] py-3 text-sm text-gray-400"
        >
          Continuar com Google
        </button>

        <button
          type="button"
          disabled
          title="Login com Facebook não disponível na demonstração"
          className="w-full cursor-not-allowed rounded-lg border border-[#795B4D] py-3 text-sm text-gray-400"
        >
          Continuar com Facebook
        </button>
      </div>

      <p className="mt-10 text-center text-sm text-gray-300">
        Novo na Kurio?{" "}
        <Link
          to="/register"
          className="font-semibold text-[#F2B654] hover:underline"
        >
          Crie uma conta
        </Link>
      </p>
    </AuthModal>
  );
}

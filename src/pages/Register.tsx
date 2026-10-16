
import { useState, type FormEvent } from 'react'
import { isAxiosError } from 'axios'
import { Link, useNavigate } from '@tanstack/react-router'

import { AuthModal } from '../components/AuthModal'
import { useAuth } from '../contexts/AuthContext'

export function Register() {
  const navigate = useNavigate()
  const { register, user } = useAuth()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.')
      return
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.')
      return
    }

    setIsSubmitting(true)

    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
      })

      await navigate({
        to: '/',
        search: {
          search: '',
          page: 1,
          network: 'all',
          sort: 'newest',
        },
      })
    } catch (err) {
      if (isAxiosError(err)) {
        setError(
          err.response?.data?.message ??
            'Não foi possível criar sua conta.',
        )
      } else {
        setError('Ocorreu um erro inesperado.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (user) {
    return (
      <AuthModal>
        <div className="py-16 text-center">
          <h1 className="text-2xl font-bold">
            Você já está conectado
          </h1>

          <Link
            to="/"
            search={{
              search: '',
              page: 1,
              network: 'all',
              sort: 'newest',
            }}
            className="mt-6 inline-block text-[#D9944E]"
          >
            Voltar ao marketplace
          </Link>
        </div>
      </AuthModal>
    )
  }

  return (
    <AuthModal>
      <div className="mb-12 mt-10 text-center md:mb-8 md:mt-0">
        <Link
          to="/"
          search={{
            search: '',
            page: 1,
            network: 'all',
            sort: 'newest',
          }}
          className="text-3xl font-black tracking-[0.2em] md:text-xl"
        >
          KURIO
        </Link>
      </div>

      <h1 className="mb-8 text-center text-xl font-bold">
        Criar perfil de colecionador
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="register-name" className="sr-only">
            Nome de usuário
          </label>

          <input
            id="register-name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Nome de usuário"
            required
            className="w-full rounded-lg border border-[#795B4D] bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-[#B8A49A] focus:border-[#D9944E]"
          />
        </div>

        <div>
          <label htmlFor="register-email" className="sr-only">
            E-mail
          </label>

          <input
            id="register-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Digite seu e-mail"
            required
            className="w-full rounded-lg border border-[#795B4D] bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-[#B8A49A] focus:border-[#D9944E]"
          />
        </div>

        <div className="relative">
          <label htmlFor="register-password" className="sr-only">
            Senha
          </label>

          <input
            id="register-password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Senha"
            minLength={6}
            required
            className="w-full rounded-lg border border-[#795B4D] bg-transparent px-4 py-3 pr-12 text-sm text-white outline-none placeholder:text-[#B8A49A] focus:border-[#D9944E]"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[#D9944E]"
          >
            {showPassword ? 'Ocultar' : 'Ver'}
          </button>
        </div>

        <div>
          <label htmlFor="register-confirm-password" className="sr-only">
            Confirmar senha
          </label>

          <input
            id="register-confirm-password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(event) =>
              setConfirmPassword(event.target.value)
            }
            placeholder="Confirmar senha"
            required
            className="w-full rounded-lg border border-[#795B4D] bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-[#B8A49A] focus:border-[#D9944E]"
          />
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
          {isSubmitting ? 'Criando perfil...' : 'Criar perfil'}
        </button>
      </form>

      <div className="my-8 flex items-center gap-3">
        <div className="h-px flex-1 bg-[#795B4D]" />
        <span className="text-xs text-gray-300">
          Ou continue com
        </span>
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
        Já tem uma conta?{' '}
        <Link
          to="/login"
          className="font-semibold text-[#F2B654] hover:underline"
        >
          Entre
        </Link>
      </p>
    </AuthModal>
  )
}

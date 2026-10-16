
import { useEffect } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'

import { Header } from '../components/Header'
import { useAuth } from '../contexts/AuthContext'
import { OrderHistory } from '../components/OrderHistory'

export function Profile() {
  const { user, isLoading, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading && !user) {
      void navigate({
        to: '/login',
        replace: true,
      })
    }
  }, [isLoading, user, navigate])

  function handleLogout() {
    logout()

    void navigate({
      to: '/',
      search: {
        search: '',
        page: 1,
        network: 'all',
        sort: 'newest',
      },
    })
  }

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-[#120D0B] text-white">
        <Header />

        <main className="mx-auto max-w-5xl px-4 py-16">
          <p className="text-center text-gray-400">
            {isLoading
              ? 'Carregando seu perfil...'
              : 'Redirecionando para o login...'}
          </p>
        </main>
      </div>
    )
  }

  const initials = user.name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')

  return (
    <div className="min-h-screen bg-[#120D0B] text-white">
      <Header />

      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <div className="mb-10">
          <p className="mb-2 text-sm uppercase tracking-widest text-[#D9944E]">
            Minha conta
          </p>

          <h1 className="text-3xl font-bold sm:text-4xl">
            Perfil do colecionador
          </h1>

          <p className="mt-3 text-gray-400">
            Gerencie suas informações e acompanhe suas compras.
          </p>
        </div>

        <section className="rounded-2xl border border-[#38251C] bg-[#211712] p-6 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-[#D9944E] bg-[#38251C] text-2xl font-bold text-[#D9944E]">
              {initials || '?'}
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="break-words text-2xl font-semibold">
                {user.name}
              </h2>

              <p className="mt-1 break-all text-gray-400">
                {user.email}
              </p>

              <span className="mt-3 inline-block rounded-full border border-[#D9944E]/40 bg-[#D9944E]/10 px-3 py-1 text-xs font-medium text-[#D9944E]">
                Colecionador Kurio
              </span>
            </div>
          </div>

          <div className="mt-8 border-t border-[#38251C] pt-6">
            <h3 className="text-lg font-semibold">
              Informações da conta
            </h3>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <p className="text-sm text-gray-400">
                  Nome
                </p>
                <p className="mt-1 break-words font-medium">
                  {user.name}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-400">
                  E-mail
                </p>
                <p className="mt-1 break-all font-medium">
                  {user.email}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-[#38251C] bg-[#211712] p-6 sm:p-8">
          <h2 className="text-xl font-semibold">
            Histórico de compras
          </h2>

          <p className="mt-3 text-gray-400">
            Acompanhe os NFTs adquiridos no marketplace.
          </p>

          <OrderHistory email={user.email} />
        </section>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            to="/"
            search={{
              search: '',
              page: 1,
              network: 'all',
              sort: 'newest',
            }}
            className="rounded-lg bg-[#D9944E] px-6 py-3 font-semibold text-[#120D0B] transition hover:bg-[#E9A963]"
          >
            Explorar NFTs
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-[#694331] px-6 py-3 font-semibold text-white transition hover:border-[#D9944E]"
          >
            Sair da conta
          </button>
        </div>
      </main>
    </div>
  )
}

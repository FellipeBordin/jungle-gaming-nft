
import { useState, type FormEvent } from 'react'
import { isAxiosError } from 'axios'
import { Link, useNavigate } from '@tanstack/react-router'

import { Header } from '../components/Header'
import { useCart } from '../contexts/CartContext'
import { useCreateOrder } from '../hooks/useCreateOrder'

export function Checkout() {
  const navigate = useNavigate()

  const { items, totalItems, totalEth, clearCart } = useCart()
  const createOrder = useCreateOrder()

  const [confirmedOrderId, setConfirmedOrderId] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [wallet, setWallet] = useState('')
  const [error, setError] = useState('')

  // ENVIA O PEDIDO PARA A API
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    if (!name.trim() || !email.trim() || !wallet.trim()) {
      setError('Preencha todos os campos obrigatórios.')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Informe um e-mail válido.')
      return
    }

    if (items.length === 0) {
      setError('Seu carrinho está vazio.')
      return
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
      })

      // Guarda o ID antes de limpar o carrinho
      setConfirmedOrderId(order.id)
      clearCart()
    } catch (err) {
      if (isAxiosError(err)) {
        setError(
          err.response?.data?.message ??
          'Não foi possível confirmar o pedido.',
        )
      } else {
        setError('Ocorreu um erro inesperado.')
      }
    }
  }

  // PRIMEIRO: MOSTRA A CONFIRMAÇÃO DO PEDIDO
  if (confirmedOrderId) {
    return (
      <div className="min-h-screen bg-[#120D0B] text-white">
        <Header />

        <main className="mx-auto max-w-3xl px-6 py-20 text-center">
          <div className="rounded-xl border border-[#38251C] bg-[#211712] p-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-900/30 text-3xl text-green-400">
              ✓
            </div>

            <h1 className="mt-6 text-3xl font-bold">
              Pedido confirmado!
            </h1>

            <p className="mt-4 text-gray-400">
              Sua compra simulada foi registrada com sucesso.
            </p>

            <p className="mt-6 text-sm text-gray-400">
              Número do pedido
            </p>

            <p className="mt-2 break-all text-xl font-bold text-[#D9944E]">
              {confirmedOrderId}
            </p>

            <Link
              to="/"
              search={{
                search: '',
                page: 1,
                network: 'all',
                sort: 'newest',
              }}
              className="mt-8 inline-block rounded-lg bg-[#D9944E] px-6 py-3 font-semibold text-[#120D0B]"
            >
              Voltar ao marketplace
            </Link>
          </div>
        </main>
      </div>
    )
  }

  // SEGUNDO: VERIFICA SE O CARRINHO ESTÁ VAZIO
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#120D0B] text-white">
        <Header />

        <main className="mx-auto max-w-5xl px-6 py-20 text-center">
          <h1 className="text-3xl font-bold">
            Seu carrinho está vazio
          </h1>

          <p className="mt-4 text-gray-400">
            Adicione NFTs antes de finalizar uma compra.
          </p>

          <Link
            to="/"
            search={{
              search: '',
              page: 1,
              network: 'all',
              sort: 'newest',
            }}
            className="mt-6 inline-block rounded-lg bg-[#D9944E] px-6 py-3 font-semibold text-[#120D0B]"
          >
            Explorar NFTs
          </Link>
        </main>
      </div>
    )
  }

  // TERCEIRO: EXIBE O FORMULÁRIO DE CHECKOUT
  return (
    <div className="min-h-screen bg-[#120D0B] text-white">
      <Header />

      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <button
          type="button"
          onClick={() => void navigate({ to: '/cart' })}
          className="text-sm text-[#D9944E] hover:underline"
        >
          ← Voltar ao carrinho
        </button>

        <div className="mt-8">
          <p className="text-sm uppercase tracking-widest text-[#D9944E]">
            Finalização de compra
          </p>

          <h1 className="mt-3 text-3xl font-bold">
            Checkout
          </h1>

          <p className="mt-3 text-gray-400">
            Confira seu pedido e preencha os dados abaixo.
          </p>
        </div>

        <div className="mt-10 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          {/* FORMULÁRIO */}
          <form
            onSubmit={handleSubmit}
            className="rounded-xl border border-[#38251C] bg-[#211712] p-6 sm:p-8"
          >
            <h2 className="text-xl font-bold">
              Dados do comprador
            </h2>

            <div className="mt-6 space-y-5">
              <div>
                <label
                  htmlFor="buyer-name"
                  className="mb-2 block text-sm text-gray-300"
                >
                  Nome completo
                </label>

                <input
                  id="buyer-name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Digite seu nome"
                  required
                  className="w-full rounded-lg border border-[#38251C] bg-[#120D0B] px-4 py-3 text-white outline-none focus:border-[#D9944E]"
                />
              </div>

              <div>
                <label
                  htmlFor="buyer-email"
                  className="mb-2 block text-sm text-gray-300"
                >
                  E-mail
                </label>

                <input
                  id="buyer-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="seuemail@exemplo.com"
                  required
                  className="w-full rounded-lg border border-[#38251C] bg-[#120D0B] px-4 py-3 text-white outline-none focus:border-[#D9944E]"
                />
              </div>

              <div>
                <label
                  htmlFor="buyer-wallet"
                  className="mb-2 block text-sm text-gray-300"
                >
                  Endereço da carteira digital
                </label>

                <input
                  id="buyer-wallet"
                  type="text"
                  value={wallet}
                  onChange={(event) => setWallet(event.target.value)}
                  placeholder="Informe o endereço da sua carteira"
                  required
                  className="w-full rounded-lg border border-[#38251C] bg-[#120D0B] px-4 py-3 text-white outline-none focus:border-[#D9944E]"
                />

                <p className="mt-2 text-xs text-gray-500">
                  Ambiente de demonstração. Nenhuma transação
                  real será realizada.
                </p>
              </div>
            </div>

            {/* MENSAGEM DE ERRO */}
            {error && (
              <p
                role="alert"
                className="mt-6 rounded-lg border border-[#704C2B] bg-[#38251C] p-4 text-sm text-[#E9A963]"
              >
                {error}
              </p>
            )}

            {/* BOTÃO CONFIRMAR */}
            <button
              type="submit"
              disabled={createOrder.isPending}
              className="mt-8 w-full rounded-lg bg-[#D9944E] px-6 py-4 font-bold text-[#120D0B] transition hover:bg-[#E9A963] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {createOrder.isPending
                ? 'Processando pedido...'
                : 'Confirmar pedido'}
            </button>
          </form>

          {/* RESUMO DO PEDIDO */}
          <aside className="rounded-xl border border-[#38251C] bg-[#211712] p-6">
            <h2 className="text-xl font-bold">
              Resumo do pedido
            </h2>

            <div className="mt-6 space-y-5">
              {items.map(({ nft, quantity }) => (
                <div
                  key={nft.id}
                  className="flex gap-3 border-b border-[#38251C] pb-5"
                >
                  <img
                    src={nft.imageUrl}
                    alt={nft.name}
                    className="h-16 w-16 rounded-lg object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">
                      {nft.name}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      Quantidade: {quantity}
                    </p>

                    <p className="mt-2 text-sm font-bold text-[#D9944E]">
                      {(
                        (Math.round(Number(nft.priceEth) * 100) *
                          quantity) /
                        100
                      ).toFixed(2)}{' '}
                      ETH
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-between text-sm text-gray-400">
              <span>Quantidade de itens</span>
              <span>{totalItems}</span>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-[#38251C] pt-5">
              <span className="font-semibold">
                Total
              </span>

              <span className="text-2xl font-bold text-[#D9944E]">
                {totalEth} ETH
              </span>
            </div>

            <p className="mt-6 text-xs leading-relaxed text-gray-500">
              Esta é uma simulação de compra para avaliação
              técnica. Não há cobrança ou transferência
              de criptomoedas.
            </p>
          </aside>
        </div>
      </main>
    </div>
  )
}

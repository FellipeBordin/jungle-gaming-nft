
import { useEffect, type ReactNode } from 'react'
import { useNavigate } from '@tanstack/react-router'

import {
  MarketplaceContent,
  defaultMarketplaceSearch,
} from './MarketplaceContent'

interface AuthModalProps {
  children: ReactNode
}

export function AuthModal({ children }: AuthModalProps) {
  const navigate = useNavigate()

  function closeModal() {
    void navigate({
      to: '/',
      search: defaultMarketplaceSearch,
    })
  }

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        void navigate({
          to: '/',
          search: defaultMarketplaceSearch,
        })
      }
    }

    window.addEventListener('keydown', handleEscape)

    return () => {
      window.removeEventListener('keydown', handleEscape)
    }
  }, [navigate])

  return (
    <>
      {/* MARKETPLACE AO FUNDO: SOMENTE DESKTOP */}
      <div
        aria-hidden="true"
        className="pointer-events-none hidden md:block"
      >
        <MarketplaceContent
          filters={defaultMarketplaceSearch}
          background
        />
      </div>

      {/* MODAL / TELA MOBILE */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#120D0B] md:bg-black/75 md:p-6">
        <button
          type="button"
          aria-label="Fechar autenticação"
          onClick={closeModal}
          className="absolute inset-0 hidden cursor-default md:block"
        />

        <div
          role="dialog"
          aria-modal="true"
          aria-label="Autenticação Kurio"
          className="relative z-10 flex h-full w-full flex-col overflow-y-auto bg-[#211712] px-6 py-10 text-white md:h-auto md:max-h-[90vh] md:max-w-md md:rounded-2xl md:border md:border-[#38251C] md:p-8"
        >
          <button
            type="button"
            onClick={closeModal}
            aria-label="Fechar"
            className="absolute right-5 top-5 text-xl text-gray-400 hover:text-white"
          >
            ×
          </button>

          {children}
        </div>
      </div>
    </>
  )
}

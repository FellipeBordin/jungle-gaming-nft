
import { useSearch } from '@tanstack/react-router'

import { MarketplaceContent } from '../components/MarketplaceContent'

export function Home() {
  const filters = useSearch({ from: '/' })

  return <MarketplaceContent filters={filters} />
}

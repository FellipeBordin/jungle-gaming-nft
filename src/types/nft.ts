export interface NFT {
  id: string;
  name: string;
  collection: string;
  imageUrl: string;
  priceEth: string;
  available: number;
  network: "ethereum" | "polygon" | "solana";
  version: number;

  // Informações adicionais para a tela de detalhes
  description?: string;
  tokenId?: string;
  edition?: string;
  editions?: string[];
  attributes?: string[];
  rating?: number;
  reviewCount?: number;
}

export interface NFTListResponse {
  items: NFT[];
  total: number;
  page: number;
  pageSize: number;
}

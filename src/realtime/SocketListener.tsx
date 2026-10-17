import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { NFT, NFTListResponse } from "../types/nft";
import { socket } from "./socket";

interface NFTUpdatedEvent {
  nftId: string;
  version: number;
  available: number;
  updatedAt: string;
}

interface OrderUpdatedEvent {
  orderId: string;
  status: string;
}

export function SocketListener() {
  const queryClient = useQueryClient();

  useEffect(() => {
    function handleConnect() {
      console.log("Socket.IO conectado:", socket.id);

      // Sincroniza os dados ao conectar ou reconectar.
      void queryClient.invalidateQueries({
        queryKey: ["nfts"],
      });

      void queryClient.invalidateQueries({
        queryKey: ["marketplace-complete-catalog"],
      });

      void queryClient.invalidateQueries({
        queryKey: ["nft-details"],
      });

      void queryClient.invalidateQueries({
        queryKey: ["related-nfts"],
      });

      void queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
    }

    function handleNFTUpdated(event: NFTUpdatedEvent) {
      console.log("NFT atualizado:", event);

      function updateNFT(nft: NFT): NFT {
        // Ignora eventos antigos ou do NFT incorreto.
        if (nft.id !== event.nftId || event.version <= nft.version) {
          return nft;
        }

        return {
          ...nft,
          available: event.available,
          version: event.version,
        };
      }

      // Atualiza os caches de listagens paginadas.
      queryClient.setQueriesData<NFTListResponse>(
        { queryKey: ["nfts"] },
        (previous) => {
          if (!previous) return previous;

          return {
            ...previous,
            items: previous.items.map(updateNFT),
          };
        },
      );

      // Atualiza o catálogo principal do marketplace.
      queryClient.setQueriesData<NFT[]>(
        { queryKey: ["marketplace-complete-catalog"] },
        (previous) => previous?.map(updateNFT),
      );

      // Atualiza a página de detalhes do NFT.
      queryClient.setQueryData<NFT | null>(
        ["nft-details", event.nftId],
        (previous) => (previous ? updateNFT(previous) : previous),
      );

      // Atualiza os NFTs relacionados.
      queryClient.setQueriesData<NFT[]>(
        { queryKey: ["related-nfts"] },
        (previous) => previous?.map(updateNFT),
      );

      // Atualiza os destaques da página inicial.
      queryClient.setQueriesData<NFT[]>(
        { queryKey: ["featured-nfts"] },
        (previous) => previous?.map(updateNFT),
      );

      // Atualiza as recomendações do carrinho.
      queryClient.setQueriesData<NFT[]>(
        { queryKey: ["cart-recommended-nfts"] },
        (previous) => previous?.map(updateNFT),
      );

      // Atualiza o NFT em destaque na barra lateral.
      queryClient.setQueryData<NFT>(
        ["sidebar-featured-nft", event.nftId],
        (previous) => (previous ? updateNFT(previous) : previous),
      );
    }

    function handleOrderUpdated(event: OrderUpdatedEvent) {
      console.log("Pedido atualizado:", event);

      void queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
    }

    socket.on("connect", handleConnect);
    socket.on("nft.updated", handleNFTUpdated);
    socket.on("order.updated", handleOrderUpdated);

    socket.connect();

    return () => {
      socket.off("connect", handleConnect);
      socket.off("nft.updated", handleNFTUpdated);
      socket.off("order.updated", handleOrderUpdated);

      socket.disconnect();
    };
  }, [queryClient]);

  return null;
}

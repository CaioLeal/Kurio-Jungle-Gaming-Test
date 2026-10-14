import { io, type Socket } from 'socket.io-client';
import type { QueryClient } from '@tanstack/react-query';

export interface NftUpdatedEvent {
  eventId: string;
  nftId: string;
  price: string;
  available: number;
  version: number;
}

export interface OrderUpdatedEvent {
  eventId: string;
  orderId: string;
  status: 'pending' | 'confirmed' | 'rejected';
  version: number;
}

const processedVersions: Record<string, number> = {};

export function setupRealtimeSocket(
  queryClient: QueryClient,
  onRealtimeNotice?: (msg: string) => void
): Socket {
  const socket = io(window.location.origin, {
    autoConnect: true,
    reconnection: true,
    transports: ['polling', 'websocket'],
  });

  const handleNftUpdated = (payload: NftUpdatedEvent) => {
    const key = `nft_${payload.nftId}`;
    if ((processedVersions[key] || 0) >= payload.version) {
      return; // Ignora evento duplicado ou antigo conforme Seção 7 do README
    }
    processedVersions[key] = payload.version;

    queryClient.invalidateQueries({ queryKey: ['nfts'] });
    queryClient.invalidateQueries({ queryKey: ['nft', payload.nftId] });
    queryClient.invalidateQueries({ queryKey: ['cart'] });

    if (onRealtimeNotice) {
      onRealtimeNotice(
        `Atualização em tempo real: NFT #${payload.nftId} atualizado para ${payload.price} ETH (v${payload.version}).`
      );
    }
  };

  const handleOrderUpdated = (payload: OrderUpdatedEvent) => {
    const key = `order_${payload.orderId}`;
    if ((processedVersions[key] || 0) >= payload.version) {
      return;
    }
    processedVersions[key] = payload.version;
    queryClient.invalidateQueries({ queryKey: ['latest-order'] });
  };

  socket.on('nft.updated', handleNftUpdated);
  socket.on('order.updated', handleOrderUpdated);

  // Suporte para disparo determinístico em testes Playwright e simulação MSW
  const customHandler = (e: Event) => {
    const detail = (e as CustomEvent).detail;
    if (detail?.type === 'nft.updated') handleNftUpdated(detail.payload);
    if (detail?.type === 'order.updated') handleOrderUpdated(detail.payload);
  };
  window.addEventListener('kurio:socket-event', customHandler);

  socket.on('connect', () => {
    queryClient.invalidateQueries({ queryKey: ['cart'] });
  });

  return socket;
}
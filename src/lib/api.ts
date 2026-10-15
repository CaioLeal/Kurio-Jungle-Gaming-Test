import axios from 'axios';

export const api = axios.create({
  baseURL: '/api',
  timeout: 8000,
});

// Garante que se o navegador suspender o Service Worker do MSW em segundo plano,
// ele seja reativado automaticamente sem quebrar a tela com dados vazios
api.interceptors.response.use(async (response) => {
  if (
    typeof response.data === 'string' &&
    response.data.trim().startsWith('<!doctype html')
  ) {
    try {
      const { worker } = await import('../mocks/browser');
      await worker.start({
        onUnhandledRequest: 'bypass',
        serviceWorker: { url: '/mockServiceWorker.js' },
      } as any);
      return api.request(response.config);
    } catch {
      // fallback
    }
  }
  return response;
});

export interface EditionStock {
  label: '1/1' | '1/10' | '1/50' | 'ABERTA';
  available: number;
  priceMultiplier: number;
}

export interface NftItem {
  id: string;
  tokenId: string;
  name: string;
  price: string; // String decimal ETH conforme README
  oldPrice?: string;
  collection: string;
  network: 'Ethereum' | 'Polygon' | 'Solana';
  badge?: string;
  image: string;
  gallery: string[];
  description: string;
  attributes: string[];
  editions: EditionStock[];
  reviewsCount: number;
  rating: number;
  version: number;
}

export interface CartItem {
  nftId: string;
  edition: string;
  quantity: number;
  nft: NftItem;
}

export interface QuoteSummary {
  items: CartItem[];
  coupon: string | null;
  subtotal: string;
  discount: string;
  networkFee: string;
  total: string;
  quoteVersion: number;
}

export interface UserProfile {
  id: string;
  displayName: string;
  username: string;
  email: string;
  ensName: string;
  ensDomain: string;
  walletAlias: string;
  avatarUrl: string;
}

export interface WalletInfo {
  id: string;
  type: 'primary' | 'secondary';
  displayName: string;
  walletAlias: string;
  network: string;
  profileName: string;
  address: string;
  secondaryAddress?: string;
  walletProvider: string;
  referralCode: string;
  email: string;
  ensDomain: string;
  ensName: string;
}

export interface OrderReceipt {
  id: string;
  txHash: string;
  status: 'pending' | 'confirmed' | 'rejected';
  createdAt: string;
  walletProvider: string;
  network: string;
  items: Array<{
    nftId: string;
    name: string;
    tokenId: string;
    image: string;
    edition: string;
    quantity: number;
    unitPrice: string;
    subtotal: string;
  }>;
  subtotal: string;
  discount: string;
  networkFee: string;
  total: string;
}
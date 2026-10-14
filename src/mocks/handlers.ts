import { http, HttpResponse, delay } from 'msw';
import type { NftItem, UserProfile, WalletInfo, OrderReceipt } from '../lib/api';

// Gerador de arte SVG estilo Kurio Ape para garantir carregamento instantâneo e visual fiel
const createApeSvg = (bg: string, fur: string, jacket: string, glasses: string, label: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
    <defs>
      <radialGradient id="g" cx="50%" cy="45%" r="60%">
        <stop offset="0%" stop-color="#f5efea"/>
        <stop offset="100%" stop-color="${bg}"/>
      </radialGradient>
    </defs>
    <rect width="400" height="400" rx="24" fill="url(#g)"/>
    <!-- Orelhas -->
    <circle cx="115" cy="185" r="34" fill="${fur}"/>
    <circle cx="115" cy="185" r="20" fill="#d2a68d"/>
    <circle cx="285" cy="185" r="34" fill="${fur}"/>
    <circle cx="285" cy="185" r="20" fill="#d2a68d"/>
    <!-- Jaqueta / Corpo -->
    <path d="M85 400 C90 295 310 295 315 400 Z" fill="${jacket}"/>
    <path d="M160 315 L200 390 L240 315" fill="#f5efea"/>
    <!-- Cabeça -->
    <ellipse cx="200" cy="180" rx="82" ry="78" fill="${fur}"/>
    <!-- Focinho -->
    <ellipse cx="200" cy="212" rx="58" ry="44" fill="#d8b29c"/>
    <path d="M168 228 Q200 242 232 224" stroke="#3b2314" stroke-width="5" fill="none" stroke-linecap="round"/>
    <circle cx="188" cy="196" r="5" fill="#3b2314"/>
    <circle cx="212" cy="196" r="5" fill="#3b2314"/>
    <!-- Óculos -->
    <circle cx="166" cy="162" r="26" fill="${glasses}" stroke="#e6c387" stroke-width="6"/>
    <circle cx="234" cy="162" r="26" fill="${glasses}" stroke="#e6c387" stroke-width="6"/>
    <line x1="192" y1="162" x2="208" y2="162" stroke="#e6c387" stroke-width="6"/>
    <!-- Colar Esmeralda -->
    <circle cx="200" cy="355" r="10" fill="#059669" stroke="#fbbf24" stroke-width="4"/>
    <text x="200" y="388" font-family="monospace" font-size="11" fill="#ffffff" text-anchor="middle" opacity="0.45">${label}</text>
  </svg>
`)}`;

const INITIAL_NFTS: NftItem[] = [
  {
    id: '1',
    tokenId: '#0042',
    name: 'Emerald Ape #042',
    price: '1.19',
    collection: 'Arte digital',
    network: 'Ethereum',
    image: createApeSvg('#cfd8c0', '#5a3825', '#0f5132', '#1f2937', 'Emerald Ape #042'),
    gallery: [
      createApeSvg('#cfd8c0', '#5a3825', '#0f5132', '#1f2937', 'Emerald Ape #042'),
      createApeSvg('#d8cfc0', '#5a3825', '#14532d', '#111827', 'Emerald Ape #042 - Pose 2'),
      createApeSvg('#c0d8cf', '#5a3825', '#064e3b', '#1f2937', 'Emerald Ape #042 - Pose 3'),
      createApeSvg('#cfd8c0', '#4a2c1d', '#0f5132', '#374151', 'Emerald Ape #042 - Pose 4'),
    ],
    description:
      'Um colecionável digital finalizado à mão da coleção Kurio Editions, verificado na Ethereum, com arte desbloqueável e acesso para colecionadores.',
    attributes: ['Óculos', 'Esmeralda', 'Raro'],
    editions: [
      { label: '1/1', available: 1, priceMultiplier: 2 },
      { label: '1/10', available: 5, priceMultiplier: 1.5 },
      { label: '1/50', available: 12, priceMultiplier: 1 },
      { label: 'ABERTA', available: 50, priceMultiplier: 0.8 },
    ],
    reviewsCount: 19,
    rating: 4.8,
    version: 1,
  },
  {
    id: '2',
    tokenId: '#0009',
    name: 'Sage Nomad #009',
    price: '1.69',
    collection: 'Arte 3D',
    network: 'Ethereum',
    image: createApeSvg('#d7e3d4', '#6b7280', '#5b4b8a', '#374151', 'Sage Nomad #009'),
    gallery: [createApeSvg('#d7e3d4', '#6b7280', '#5b4b8a', '#374151', 'Sage Nomad #009')],
    description:
      'Edição especial da série Nomad com capuz violeta e chapéu bucket, cunhado em alta resolução na rede Ethereum.',
    attributes: ['Bucket Hat', 'Hoodie Violeta', 'Gênesis'],
    editions: [
      { label: '1/1', available: 1, priceMultiplier: 2 },
      { label: '1/10', available: 4, priceMultiplier: 1.2 },
      { label: '1/50', available: 15, priceMultiplier: 1 },
      { label: 'ABERTA', available: 30, priceMultiplier: 0.9 },
    ],
    reviewsCount: 14,
    rating: 4.9,
    version: 1,
  },
  {
    id: '3',
    tokenId: '#0552',
    name: 'Neon Vessel #552',
    price: '1.99',
    oldPrice: '2.29',
    collection: 'Arte digital',
    network: 'Polygon',
    badge: 'RARO',
    image: createApeSvg('#c9dcd6', '#27272a', '#e5dec9', '#09090b', 'Neon Vessel #552'),
    gallery: [createApeSvg('#c9dcd6', '#27272a', '#e5dec9', '#09090b', 'Neon Vessel #552')],
    description:
      'Peça rara com alfaiataria clara e gola alta verde-escura, acompanhada de metadados imutáveis no IPFS.',
    attributes: ['Alfaiataria', 'Brinco Ouro', 'Raro'],
    editions: [
      { label: '1/1', available: 1, priceMultiplier: 1.5 },
      { label: '1/10', available: 3, priceMultiplier: 1.2 },
      { label: '1/50', available: 10, priceMultiplier: 1 },
      { label: 'ABERTA', available: 0, priceMultiplier: 1 },
    ],
    reviewsCount: 27,
    rating: 5.0,
    version: 1,
  },
  {
    id: '4',
    tokenId: '#0118',
    name: 'Cosmic Bloom #118',
    price: '1.29',
    collection: 'Colecionáveis',
    network: 'Ethereum',
    image: createApeSvg('#e2e8dd', '#71717a', '#4c1d95', '#18181b', 'Cosmic Bloom #118'),
    gallery: [createApeSvg('#e2e8dd', '#71717a', '#4c1d95', '#18181b', 'Cosmic Bloom #118')],
    description:
      'Colecionável verificado da coleção Kurio Apes com estética urbana e registro permanente de procedência.',
    attributes: ['Urbano', 'Violeta', 'Verificado'],
    editions: [
      { label: '1/1', available: 1, priceMultiplier: 1.8 },
      { label: '1/10', available: 6, priceMultiplier: 1.2 },
      { label: '1/50', available: 20, priceMultiplier: 1 },
      { label: 'ABERTA', available: 40, priceMultiplier: 0.85 },
    ],
    reviewsCount: 11,
    rating: 4.7,
    version: 1,
  },
  {
    id: '5',
    tokenId: '#0314',
    name: 'Violet Nomad #314',
    price: '1.39',
    collection: 'Generativa',
    network: 'Solana',
    image: createApeSvg('#dce6df', '#64748b', '#581c87', '#0f172a', 'Violet Nomad #314'),
    gallery: [createApeSvg('#dce6df', '#64748b', '#581c87', '#0f172a', 'Violet Nomad #314')],
    description:
      'Obra generativa da série Nomad com traços raros e participação nos lançamentos exclusivos da comunidade.',
    attributes: ['Nomad', 'Capuz Roxo', 'Som'],
    editions: [
      { label: '1/1', available: 1, priceMultiplier: 2 },
      { label: '1/10', available: 8, priceMultiplier: 1.3 },
      { label: '1/50', available: 18, priceMultiplier: 1 },
      { label: 'ABERTA', available: 25, priceMultiplier: 0.9 },
    ],
    reviewsCount: 19,
    rating: 4.8,
    version: 1,
  },
  {
    id: '6',
    tokenId: '#0088',
    name: 'Ivory Baron #088',
    price: '1.79',
    collection: 'Arte 3D',
    network: 'Ethereum',
    image: createApeSvg('#cde0d8', '#3f3f46', '#d6d3c4', '#18181b', 'Ivory Baron #088'),
    gallery: [createApeSvg('#cde0d8', '#3f3f46', '#d6d3c4', '#18181b', 'Ivory Baron #088')],
    description:
      'Ivory Baron combina modelagem 3D e acabamento clássico, garantindo direitos de exibição para o detentor.',
    attributes: ['Barão', 'Blazer Marfim', '3D'],
    editions: [
      { label: '1/1', available: 2, priceMultiplier: 1.5 },
      { label: '1/10', available: 9, priceMultiplier: 1.2 },
      { label: '1/50', available: 15, priceMultiplier: 1 },
      { label: 'ABERTA', available: 30, priceMultiplier: 0.9 },
    ],
    reviewsCount: 22,
    rating: 4.9,
    version: 1,
  },
  {
    id: '7',
    tokenId: '#0207',
    name: 'Golden Beat #207',
    price: '0.99',
    collection: 'Música',
    network: 'Polygon',
    image: createApeSvg('#e5dec9', '#d97706', '#e7e5e4', '#065f46', 'Golden Beat #207'),
    gallery: [createApeSvg('#e5dec9', '#d97706', '#e7e5e4', '#065f46', 'Golden Beat #207')],
    description:
      'Edição musical com headphones verdes e pelagem dourada. Inclui faixa de áudio exclusiva desbloqueável.',
    attributes: ['Headphones', 'Pelagem Dourada', 'Áudio'],
    editions: [
      { label: '1/1', available: 1, priceMultiplier: 2 },
      { label: '1/10', available: 5, priceMultiplier: 1.3 },
      { label: '1/50', available: 25, priceMultiplier: 1 },
      { label: 'ABERTA', available: 60, priceMultiplier: 0.8 },
    ],
    reviewsCount: 9,
    rating: 4.6,
    version: 1,
  },
  {
    id: '8',
    tokenId: '#0071',
    name: 'Golden Frequency #071',
    price: '0.59',
    collection: 'Fotografia',
    network: 'Ethereum',
    image: createApeSvg('#e2dfd5', '#b45309', '#f5f5f4', '#047857', 'Golden Frequency #071'),
    gallery: [createApeSvg('#e2dfd5', '#b45309', '#f5f5f4', '#047857', 'Golden Frequency #071')],
    description:
      'Frequência dourada capturada para colecionadores que valorizam harmonia visual e raridade verificada.',
    attributes: ['Frequência', 'Ouro', 'Estúdio'],
    editions: [
      { label: '1/1', available: 1, priceMultiplier: 2 },
      { label: '1/10', available: 7, priceMultiplier: 1.2 },
      { label: '1/50', available: 30, priceMultiplier: 1 },
      { label: 'ABERTA', available: 50, priceMultiplier: 0.85 },
    ],
    reviewsCount: 16,
    rating: 4.7,
    version: 1,
  },
  {
    id: '9',
    tokenId: '#0160',
    name: 'Golden Signal #160',
    price: '0.39',
    collection: 'Jogos',
    network: 'Solana',
    image: createApeSvg('#ede8d8', '#f59e0b', '#fafaf9', '#064e3b', 'Golden Signal #160'),
    gallery: [createApeSvg('#ede8d8', '#f59e0b', '#fafaf9', '#064e3b', 'Golden Signal #160')],
    description:
      'Avatar pronto para interoperabilidade em experiências digitais e jogos parceiros do ecossistema Kurio.',
    attributes: ['Gamer', 'Headset Verde', 'Solana'],
    editions: [
      { label: '1/1', available: 1, priceMultiplier: 2 },
      { label: '1/10', available: 10, priceMultiplier: 1.2 },
      { label: '1/50', available: 40, priceMultiplier: 1 },
      { label: 'ABERTA', available: 100, priceMultiplier: 0.8 },
    ],
    reviewsCount: 31,
    rating: 4.9,
    version: 1,
  },
];

interface DbState {
  nfts: NftItem[];
  currentUser: UserProfile | null;
  favoritesByUser: Record<string, string[]>;
  cart: Array<{ nftId: string; edition: string; quantity: number }>;
  coupon: string | null;
  walletsByUser: Record<string, WalletInfo[]>;
  ordersByIdempotencyKey: Record<string, OrderReceipt>;
  ordersById: Record<string, OrderReceipt>;
  quoteVersion: number;
}

const STORAGE_KEY = 'kurio_msw_db_v1';

function loadDb(): DbState {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {
      // fallback
    }
  }
  const initial: DbState = {
    nfts: INITIAL_NFTS,
    currentUser: {
      id: 'usr_1',
      displayName: 'Caio Colecionador',
      username: 'caiokurio',
      email: 'contato@email.com',
      ensName: 'caio',
      ensDomain: '.eth',
      walletAlias: 'Vault Principal',
      avatarUrl: INITIAL_NFTS[0].image,
    },
    favoritesByUser: { usr_1: ['1'] },
    cart: [
      { nftId: '1', edition: '1/50', quantity: 2 },
      { nftId: '5', edition: '1/50', quantity: 6 },
      { nftId: '6', edition: '1/50', quantity: 9 },
    ],
    coupon: null,
    walletsByUser: {
      usr_1: [
        {
          id: 'wal_1',
          type: 'primary',
          displayName: 'Caio Colecionador',
          walletAlias: 'MetaMask Principal',
          network: 'Ethereum',
          profileName: 'caiokurio',
          address: '0x742d35Cc6634C0532925a3b8D4C0532950532950',
          secondaryAddress: 'caio.eth',
          walletProvider: 'MetaMask',
          referralCode: 'KURIO2026',
          email: 'contato@email.com',
          ensDomain: '.eth',
          ensName: 'caio',
        },
      ],
    },
    ordersByIdempotencyKey: {},
    ordersById: {},
    quoteVersion: 1,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  return initial;
}

function saveDb(db: DbState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

function computeQuote(db: DbState) {
  const detailedItems = db.cart
    .map((item) => {
      const nft = db.nfts.find((n) => n.id === item.nftId);
      if (!nft) return null;
      return { ...item, nft };
    })
    .filter((x): x is NonNullable<typeof x> => Boolean(x));

  const subtotalNum = detailedItems.reduce(
    (acc, item) => acc + parseFloat(item.nft.price) * item.quantity,
    0
  );
  const discountNum =
    db.coupon === 'KURIO10' || db.coupon === 'AMOR10' ? subtotalNum * 0.1 : 0;
  const networkFeeNum = detailedItems.length > 0 ? 0.016 : 0;
  const totalNum = Math.max(0, subtotalNum - discountNum) + networkFeeNum;

  return {
    items: detailedItems,
    coupon: db.coupon,
    subtotal: subtotalNum.toFixed(2),
    discount: discountNum.toFixed(2),
    networkFee: networkFeeNum.toFixed(3),
    total: totalNum.toFixed(3),
    quoteVersion: db.quoteVersion,
  };
}

export const handlers = [
  // Reset de cenário para testes Playwright
  http.post('/api/test/reset', () => {
    localStorage.removeItem(STORAGE_KEY);
    const db = loadDb();
    return HttpResponse.json({ ok: true, db });
  }),

  // Sessão
  http.get('/api/session', async () => {
    await delay(150);
    const db = loadDb();
    return HttpResponse.json({ user: db.currentUser });
  }),

  http.post('/api/login', async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as { email?: string; password?: string };
    if (!body.email || !body.password || body.password.length < 4) {
      return HttpResponse.json(
        { message: 'Credenciais inválidas. Verifique seu e-mail e senha.' },
        { status: 401 }
      );
    }
    const db = loadDb();
    db.currentUser = {
      id: body.email === 'segundo@kurio.io' ? 'usr_2' : 'usr_1',
      displayName: body.email.split('@')[0],
      username: body.email.split('@')[0].toLowerCase(),
      email: body.email,
      ensName: body.email.split('@')[0].toLowerCase(),
      ensDomain: '.eth',
      walletAlias: 'MetaMask Principal',
      avatarUrl: db.nfts[0].image,
    };
    saveDb(db);
    return HttpResponse.json({ user: db.currentUser });
  }),

  http.post('/api/register', async ({ request }) => {
    await delay(350);
    const body = (await request.json()) as {
      username?: string;
      email?: string;
      password?: string;
    };
    if (body.email === 'conflito@kurio.io') {
      return HttpResponse.json(
        { message: 'Este endereço de e-mail já está em uso por outro colecionador.' },
        { status: 409 }
      );
    }
    const db = loadDb();
    db.currentUser = {
      id: 'usr_' + Date.now(),
      displayName: body.username || 'Novo Colecionador',
      username: (body.username || 'colecionador').toLowerCase(),
      email: body.email || 'novo@email.com',
      ensName: (body.username || 'kurio').toLowerCase(),
      ensDomain: '.eth',
      walletAlias: 'Carteira Principal',
      avatarUrl: db.nfts[0].image,
    };
    saveDb(db);
    return HttpResponse.json({ user: db.currentUser }, { status: 201 });
  }),

  http.post('/api/logout', async () => {
    await delay(100);
    const db = loadDb();
    db.currentUser = null;
    saveDb(db);
    return HttpResponse.json({ ok: true });
  }),

  // Listagem de NFTs com busca, filtros, ordenação e paginação
  http.get('/api/nfts', async ({ request }) => {
    await delay(250);
    const url = new URL(request.url);
    const search = (url.searchParams.get('q') || '').toLowerCase();
    const collection = url.searchParams.get('collection') || '';
    const network = url.searchParams.get('network') || '';
    const maxPrice = parseFloat(url.searchParams.get('maxPrice') || '999');
    const sort = url.searchParams.get('sort') || 'recent';
    const tab = url.searchParams.get('tab') || 'all';
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));
    const pageSize = parseInt(url.searchParams.get('pageSize') || '9', 10);

    const db = loadDb();
    let list = [...db.nfts];

    if (search) {
      list = list.filter(
        (n) =>
          n.name.toLowerCase().includes(search) ||
          n.collection.toLowerCase().includes(search)
      );
    }
    if (collection) {
      list = list.filter((n) => n.collection === collection);
    }
    if (network) {
      list = list.filter((n) => n.network === network);
    }
    if (!Number.isNaN(maxPrice)) {
      list = list.filter((n) => parseFloat(n.price) <= maxPrice);
    }
    if (tab === 'new') {
      list = list.slice(0, 6);
    } else if (tab === 'trending') {
      list = [...list].sort((a, b) => b.reviewsCount - a.reviewsCount);
    }

    if (sort === 'price_asc') {
      list.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (sort === 'price_desc') {
      list.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    }

    const totalItems = list.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const items = list.slice((page - 1) * pageSize, page * pageSize);

    return HttpResponse.json({
      items,
      page,
      totalPages,
      totalItems,
    });
  }),

  // Detalhe do NFT
  http.get('/api/nfts/:id', async ({ params }) => {
    await delay(200);
    const db = loadDb();
    const nft = db.nfts.find((n) => n.id === params.id);
    if (!nft) {
      return HttpResponse.json({ message: 'NFT não encontrado.' }, { status: 404 });
    }
    return HttpResponse.json({ nft, related: db.nfts.filter((n) => n.id !== nft.id).slice(0, 5) });
  }),

  // Favoritos
  http.get('/api/favorites', async () => {
    const db = loadDb();
    const userId = db.currentUser?.id || 'guest';
    return HttpResponse.json({ favorites: db.favoritesByUser[userId] || [] });
  }),

  http.post('/api/favorites/:id', async ({ params }) => {
    await delay(150);
    const db = loadDb();
    if (!db.currentUser) {
      return HttpResponse.json({ message: 'Autenticação necessária.' }, { status: 401 });
    }
    const userId = db.currentUser.id;
    const id = String(params.id);
    const current = db.favoritesByUser[userId] || [];
    const exists = current.includes(id);
    db.favoritesByUser[userId] = exists
      ? current.filter((item) => item !== id)
      : [...current, id];
    saveDb(db);
    return HttpResponse.json({ favorites: db.favoritesByUser[userId] });
  }),

  // Carrinho e Cotação
  http.get('/api/cart', async () => {
    await delay(180);
    const db = loadDb();
    return HttpResponse.json(computeQuote(db));
  }),

  http.post('/api/cart/items', async ({ request }) => {
    await delay(200);
    const body = (await request.json()) as {
      nftId: string;
      edition?: string;
      quantity: number;
    };
    const db = loadDb();
    const nft = db.nfts.find((n) => n.id === body.nftId);
    if (!nft) {
      return HttpResponse.json({ message: 'NFT inexistente.' }, { status: 404 });
    }
    const editionLabel = body.edition || '1/50';
    const editionObj = nft.editions.find((e) => e.label === editionLabel);
    if (!editionObj || editionObj.available < body.quantity) {
      return HttpResponse.json(
        { message: 'Quantidade indisponível para esta edição.' },
        { status: 409 }
      );
    }

    const existing = db.cart.find(
      (i) => i.nftId === body.nftId && i.edition === editionLabel
    );
    if (existing) {
      existing.quantity = Math.min(editionObj.available, existing.quantity + body.quantity);
    } else {
      db.cart.push({
        nftId: body.nftId,
        edition: editionLabel,
        quantity: body.quantity,
      });
    }
    db.quoteVersion += 1;
    saveDb(db);
    return HttpResponse.json(computeQuote(db));
  }),

  http.patch('/api/cart/items/:nftId', async ({ params, request }) => {
    await delay(150);
    const body = (await request.json()) as { quantity: number; edition?: string };
    const db = loadDb();
    const nftId = String(params.nftId);
    if (body.quantity <= 0) {
      db.cart = db.cart.filter((i) => i.nftId !== nftId);
    } else {
      const item = db.cart.find((i) => i.nftId === nftId);
      if (item) {
        item.quantity = body.quantity;
      }
    }
    db.quoteVersion += 1;
    saveDb(db);
    return HttpResponse.json(computeQuote(db));
  }),

  http.delete('/api/cart/items/:nftId', async ({ params }) => {
    await delay(150);
    const db = loadDb();
    db.cart = db.cart.filter((i) => i.nftId !== String(params.nftId));
    db.quoteVersion += 1;
    saveDb(db);
    return HttpResponse.json(computeQuote(db));
  }),

  http.post('/api/cart/coupon', async ({ request }) => {
    await delay(200);
    const body = (await request.json()) as { code: string };
    const code = (body.code || '').trim().toUpperCase();
    const db = loadDb();
    if (!code) {
      db.coupon = null;
      db.quoteVersion += 1;
      saveDb(db);
      return HttpResponse.json(computeQuote(db));
    }
    if (code !== 'KURIO10' && code !== 'AMOR10') {
      return HttpResponse.json(
        { message: 'Código promocional inválido ou expirado.' },
        { status: 422 }
      );
    }
    db.coupon = code;
    db.quoteVersion += 1;
    saveDb(db);
    return HttpResponse.json(computeQuote(db));
  }),

  // Criação Idempotente de Pedido
  http.post('/api/orders', async ({ request }) => {
    await delay(400);
    const idempotencyKey = request.headers.get('Idempotency-Key') || 'default_key';
    const body = (await request.json()) as {
      walletProvider: string;
      network: string;
      quoteVersion?: number;
      simulateFailure?: boolean;
    };
    const db = loadDb();

    if (db.ordersByIdempotencyKey[idempotencyKey]) {
      return HttpResponse.json({ order: db.ordersByIdempotencyKey[idempotencyKey] });
    }

    const quote = computeQuote(db);
    if (quote.items.length === 0) {
      return HttpResponse.json({ message: 'O carrinho está vazio.' }, { status: 400 });
    }

    if (body.quoteVersion && body.quoteVersion !== db.quoteVersion) {
      return HttpResponse.json(
        {
          message:
            'O preço ou disponibilidade de um NFT mudou. Revise o resumo atualizado antes de confirmar.',
          quote,
        },
        { status: 409 }
      );
    }

    const orderId = 'ord_' + Math.random().toString(36).substring(2, 9);
    const receipt: OrderReceipt = {
      id: orderId,
      txHash: '0xA91F..E82C',
      status: body.simulateFailure ? 'rejected' : 'confirmed',
      createdAt: '29 Jul, 2026',
      walletProvider: body.walletProvider || 'MetaMask',
      network: body.network || 'Ethereum',
      items: quote.items.map((i) => ({
        nftId: i.nftId,
        name: i.nft.name,
        tokenId: i.nft.tokenId,
        image: i.nft.image,
        edition: i.edition,
        quantity: i.quantity,
        unitPrice: i.nft.price,
        subtotal: (parseFloat(i.nft.price) * i.quantity).toFixed(2),
      })),
      subtotal: quote.subtotal,
      discount: quote.discount,
      networkFee: quote.networkFee,
      total: quote.total,
    };

    db.ordersByIdempotencyKey[idempotencyKey] = receipt;
    db.ordersById[orderId] = receipt;

    if (receipt.status === 'confirmed') {
      db.cart = [];
      db.coupon = null;
      db.quoteVersion += 1;
    }

    saveDb(db);
    return HttpResponse.json({ order: receipt }, { status: 201 });
  }),

  http.get('/api/orders/latest', async () => {
    const db = loadDb();
    const all = Object.values(db.ordersById);
    const latest = all[all.length - 1] || null;
    return HttpResponse.json({ order: latest });
  }),

  // Perfil e Carteiras
  http.get('/api/profile', async () => {
    const db = loadDb();
    return HttpResponse.json({
      profile: db.currentUser,
      wallets: db.walletsByUser[db.currentUser?.id || 'usr_1'] || [],
    });
  }),

  http.put('/api/profile', async ({ request }) => {
    await delay(250);
    const body = (await request.json()) as Partial<UserProfile>;
    const db = loadDb();
    if (!db.currentUser) {
      return HttpResponse.json({ message: 'Não autorizado' }, { status: 401 });
    }
    db.currentUser = { ...db.currentUser, ...body };
    saveDb(db);
    return HttpResponse.json({ profile: db.currentUser });
  }),

  http.put('/api/wallets', async ({ request }) => {
    await delay(250);
    const body = (await request.json()) as WalletInfo;
    const db = loadDb();
    const userId = db.currentUser?.id || 'usr_1';
    const list = db.walletsByUser[userId] || [];
    const idx = list.findIndex((w) => w.type === body.type);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...body };
    } else {
      list.push({ ...body, id: 'wal_' + Date.now() });
    }
    db.walletsByUser[userId] = list;
    saveDb(db);
    return HttpResponse.json({ wallets: list });
  }),
];
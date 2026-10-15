import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Heart, ShoppingCart} from 'lucide-react';
import { api, type NftItem } from '../lib/api';
import { Layout } from '../components/Layout'

const COLLECTIONS = [
  { name: 'Arte digital', count: 33 },
  { name: 'Fotografia', count: 12 },
  { name: 'Música', count: 65 },
  { name: 'Arte 3D', count: 39 },
  { name: 'Colecionáveis', count: 23 },
  { name: 'Generativa', count: 17 },
  { name: 'Jogos', count: 19 },
  { name: 'Assinaturas', count: 13 },
  { name: 'Utilidade', count: 18 },
];

const NETWORKS = [
  { name: 'Ethereum', count: 119 },
  { name: 'Polygon', count: 78 },
  { name: 'Solana', count: 86 },
];

const Home = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const getInitialParam = (key: string, fallback: string) => {
    const params = new URLSearchParams(window.location.search);
    return params.get(key) || fallback;
  };

  const [searchQuery, setSearchQuery] = useState(() => getInitialParam('q', ''));
  const [selectedCollection, setSelectedCollection] = useState(() => getInitialParam('collection', ''));
  const [selectedNetwork, setSelectedNetwork] = useState(() => getInitialParam('network', ''));
  const [maxPrice, setMaxPrice] = useState(() => getInitialParam('maxPrice', '12.30'));
  const [activeTab, setActiveTab] = useState<'all' | 'new' | 'trending'>(
    () => (getInitialParam('tab', 'all') as 'all' | 'new' | 'trending')
  );
  const [sortBy, setSortBy] = useState(() => getInitialParam('sort', 'recent'));
  const [page, setPage] = useState(() => Number(getInitialParam('page', '1')) || 1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (selectedCollection) params.set('collection', selectedCollection);
    if (selectedNetwork) params.set('network', selectedNetwork);
    if (maxPrice !== '12.30') params.set('maxPrice', maxPrice);
    if (activeTab !== 'all') params.set('tab', activeTab);
    if (sortBy !== 'recent') params.set('sort', sortBy);
    if (page > 1) params.set('page', String(page));

    const queryString = params.toString();
    const newUrl = queryString ? `${window.location.pathname}?${queryString}` : window.location.pathname;
    window.history.replaceState(null, '', newUrl);
  }, [searchQuery, selectedCollection, selectedNetwork, maxPrice, activeTab, sortBy, page]);

  const { data: nftData, isLoading } = useQuery<{
    items: NftItem[];
    totalPages: number;
  }>({
    queryKey: [
      'nfts',
      { searchQuery, selectedCollection, selectedNetwork, maxPrice, activeTab, sortBy, page },
    ],
    queryFn: async () =>
      (
        await api.get('/nfts', {
          params: {
            q: searchQuery,
            collection: selectedCollection,
            network: selectedNetwork,
            maxPrice,
            tab: activeTab,
            sort: sortBy,
            page,
            pageSize: 9,
          },
        })
      ).data,
  });

  const { data: favData } = useQuery<{ favorites: string[] }>({
    queryKey: ['favorites'],
    queryFn: async () => (await api.get('/favorites')).data,
  });

  const favoriteMutation = useMutation({
    mutationFn: async (nftId: string) => (await api.post(`/favorites/${nftId}`)).data,
    onMutate: async (nftId: string) => {
      await queryClient.cancelQueries({ queryKey: ['favorites'] });
      const previous = queryClient.getQueryData<{ favorites: string[] }>(['favorites']);
      if (previous) {
        const exists = previous.favorites.includes(nftId);
        queryClient.setQueryData(['favorites'], {
          favorites: exists
            ? previous.favorites.filter((id) => id !== nftId)
            : [...previous.favorites, nftId],
        });
      }
      return { previous };
    },
    onError: (_err, _nftId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['favorites'], context.previous);
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['favorites'] }),
  });

  const quickCartMutation = useMutation({
    mutationFn: async (nftId: string) =>
      (await api.post('/cart/items', { nftId, edition: '1/50', quantity: 1 })).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  });

  const items = nftData?.items || [];
  const favorites = favData?.favorites || [];

  return (
    <Layout>
      {/* Mobile Search Bar */}
      <div className="md:hidden flex items-center gap-3 px-4 pt-5 pb-3">
        <div className="flex-1 flex items-center bg-[#21150E] rounded-2xl px-4 py-3.5">
          <img src="/icons/SearchIcon.svg" alt="Buscar" className="w-5 h-5 mr-3 opacity-60" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Explorar coleções"
            className="bg-transparent text-sm text-[#F5EFEA] placeholder-[#B08D74] focus:outline-none w-full"
          />
        </div>
        <button
          aria-label="Filtros"
          onClick={() => setMobileFiltersOpen((prev) => !prev)}
          className="w-12 h-12 bg-[#C87D46] text-[#120B07] rounded-2xl flex items-center justify-center shrink-0 cursor-pointer"
        >
          <img src="/icons/Filter.svg" alt="Filtros" className="w-5 h-5" />
        </button>
      </div>

      {/* Gaveta de Filtros Mobile */}
      {mobileFiltersOpen && (
        <div
          role="dialog"
          aria-label="Filtros do catálogo"
          className="md:hidden mx-4 mb-4 bg-[#1C120C] border border-[#2E1F16] rounded-2xl p-5 space-y-5"
        >
          <div className="flex items-center justify-between border-b border-[#2E1F16] pb-2">
            <h3 className="text-xs font-bold text-white">Filtrar por Coleção e Rede</h3>
            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="text-xs text-[#D98236] font-bold"
            >
              Fechar ✕
            </button>
          </div>

          <div>
            <p className="text-xs font-bold text-white mb-2">Coleções</p>
            <div className="flex flex-wrap gap-2">
              {COLLECTIONS.map((col) => {
                const active = selectedCollection === col.name;
                return (
                  <button
                    key={col.name}
                    onClick={() => {
                      setSelectedCollection(active ? '' : col.name);
                      setPage(1);
                    }}
                    className={`px-2.5 py-1 rounded-full text-[11px] border ${
                      active
                        ? 'border-[#D98236] bg-[#D98236] text-[#120B07] font-bold'
                        : 'border-[#2E1F16] text-[#A3968C]'
                    }`}
                  >
                    {col.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-xs font-bold text-white mb-2">Rede</p>
            <div className="flex flex-wrap gap-2">
              {NETWORKS.map((net) => {
                const active = selectedNetwork === net.name;
                return (
                  <button
                    key={net.name}
                    onClick={() => {
                      setSelectedNetwork(active ? '' : net.name);
                      setPage(1);
                    }}
                    className={`px-3 py-1 rounded-full text-[11px] border ${
                      active
                        ? 'border-[#D98236] bg-[#D98236] text-[#120B07] font-bold'
                        : 'border-[#2E1F16] text-[#A3968C]'
                    }`}
                  >
                    {net.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Hero Section (Mobile: Card com gradiente + miniatura sobreposta | Desktop: Limpo conforme Figma) */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 pt-2 md:pt-10 pb-2 md:pb-4">
        {/* MOBILE HERO FIEL A image_d8e9c5.png */}
        <div className="md:hidden relative overflow-hidden rounded-3xl bg-linear-to-br from-[#5A3921] via-[#331F11] to-[#21140B] p-5 shadow-lg">
          {/* Círculos decorativos sutis ao fundo como no Figma */}
          <div className="pointer-events-none absolute -top-12 -left-10 w-52 h-52 rounded-full bg-[#8A5A36]/20" />
          <div className="pointer-events-none absolute -bottom-16 left-16 w-56 h-56 rounded-full bg-[#8A5A36]/15" />

          <div className="relative z-10 grid grid-cols-12 gap-3 items-center">
            <div className="col-span-7 space-y-2">
              <span className="block text-[11px] text-[#F5EFEA]/90">
                Bem-vindo à Kurio
              </span>
              <h2 className="text-[17px] font-bold text-white leading-snug tracking-tight">
                SEJA DONO DA CULTURA DIGITAL
              </h2>
              <p className="text-[11px] text-[#D5C3B5] leading-relaxed">
                Descubra NFTs selecionados de criadores do mundo todo.
              </p>
              <button
                onClick={() => navigate({ to: '/nft/1' })}
                className="inline-flex items-center gap-2 pt-1 text-xs font-bold text-[#E08B44] tracking-wide"
              >
                EXPLORAR <span>→</span>
              </button>
            </div>

            <div className="col-span-5 relative flex justify-end">
              <div className="relative w-32 h-36">
                <img
                  src={items[0]?.image || '/Image1.svg'}
                  alt="Emerald Ape"
                  className="w-full h-full object-cover rounded-2xl shadow-md"
                />
                {/* Miniatura sobreposta do segundo macaco no canto inferior esquerdo */}
                <img
                  src={items[1]?.image || '/Image2.svg'}
                  alt="Sage Nomad"
                  className="absolute -bottom-2 -left-3 w-12 h-12 object-cover rounded-xl border-2 border-[#331F11] shadow-lg"
                />
              </div>
            </div>
          </div>

          {/* 3 pontinhos indicadores no Mobile */}
          <div className="relative z-10 flex justify-center items-center gap-2 mt-4">
            <span className="w-2 h-2 rounded-full bg-[#E08B44]" />
            <span className="w-2 h-2 rounded-full bg-[#E08B44]/60" />
            <span className="w-2 h-2 rounded-full bg-[#E08B44]/60" />
          </div>
        </div>

        {/* DESKTOP HERO FIEL A image_d87d25.png */}
        <div className="hidden md:grid md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 space-y-5">
            <span className="block text-sm text-[#F5EFEA] tracking-wider">
              Bem-vindo à Kurio
            </span>
            <h1 className="text-5xl font-bold text-white leading-[1.15] tracking-tight max-w-xl">
              SEJA DONO DO FUTURO DA ARTE DIGITAL
            </h1>
            <p className="text-sm text-[#A3968C] max-w-lg leading-relaxed">
              Descubra NFTs selecionados de criadores emergentes e consagrados. Colecione arte
              digital rara, apoie artistas e tenha uma parte da cultura da internet.
            </p>
            <div className="pt-2">
              <button
                onClick={() => navigate({ to: '/nft/1' })}
                className="px-7 py-3 bg-[#D98236] hover:bg-[#c2712b] text-[#120B07] font-bold text-xs rounded transition-colors cursor-pointer uppercase tracking-wider"
              >
                EXPLORAR
              </button>
            </div>
          </div>

          <div className="md:col-span-5 flex justify-end">
            {items[0] && (
              <img
                src={items[0].image}
                alt={items[0].name}
                className="w-105 h-105 object-cover rounded-3xl"
              />
            )}
          </div>

          <div className="md:col-span-12 flex justify-center items-center gap-2 -mt-6">
            <span className="w-2 h-2 rounded-full bg-[#D98236]" />
            <span className="w-2 h-2 rounded-full bg-[#D98236]/60" />
            <span className="w-2 h-2 rounded-full bg-[#D98236]/60" />
          </div>
        </div>
      </section>

      {/* Main Catalog Grid */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-4 md:py-10 grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Sidebar Filters (Desktop) */}
        <aside className="hidden md:block md:col-span-3 space-y-6">
          <div className="bg-[#1C120C] border border-[#2E1F16] rounded-xl p-5 space-y-6">
            <div>
              <h3 className="text-xs font-bold text-white mb-4">Coleções</h3>
              <ul className="space-y-2.5 text-xs">
                {COLLECTIONS.map((col) => {
                  const active = selectedCollection === col.name;
                  return (
                    <li key={col.name}>
                      <button
                        onClick={() => {
                          setSelectedCollection(active ? '' : col.name);
                          setPage(1);
                        }}
                        className={`w-full flex justify-between items-center cursor-pointer ${
                          active ? 'text-[#D98236] font-bold' : 'text-[#A3968C] hover:text-white'
                        }`}
                      >
                        <span>{col.name}</span>
                        <span>({col.count})</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="border-t border-[#2E1F16] pt-5">
              <h3 className="text-xs font-bold text-white mb-3">Faixa de preço</h3>
              <input
                type="range"
                min="0.39"
                max="12.30"
                step="0.1"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full accent-[#D98236]"
              />
              <p className="text-[11px] text-[#A3968C] mt-2">
                Preço: 0,02 - {maxPrice.replace('.', ',')} ETH
              </p>
              <button
                onClick={() => setPage(1)}
                className="mt-3 px-4 py-1.5 bg-[#D98236] text-[#120B07] font-bold text-xs rounded cursor-pointer"
              >
                Aplicar
              </button>
            </div>

            <div className="border-t border-[#2E1F16] pt-5">
              <h3 className="text-xs font-bold text-white mb-4">Rede</h3>
              <ul className="space-y-2.5 text-xs">
                {NETWORKS.map((net) => {
                  const active = selectedNetwork === net.name;
                  return (
                    <li key={net.name}>
                      <button
                        onClick={() => {
                          setSelectedNetwork(active ? '' : net.name);
                          setPage(1);
                        }}
                        className={`w-full flex justify-between items-center cursor-pointer ${
                          active ? 'text-[#D98236] font-bold' : 'text-[#A3968C] hover:text-white'
                        }`}
                      >
                        <span>{net.name}</span>
                        <span>({net.count})</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {items[1] && (
            <div className="bg-[#1C120C] border border-[#2E1F16] rounded-xl p-5">
              <p className="text-xs font-bold text-[#D98236]">NFT EM DESTAQUE</p>
              <p className="text-sm font-bold text-white mt-1 mb-4">OFERTA LIMITADA</p>
              <img
                src={items[1].image}
                alt="Destaque"
                onClick={() => navigate({ to: `/nft/${items[1].id}` })}
                className="w-full aspect-square object-cover rounded-xl cursor-pointer"
              />
            </div>
          )}
        </aside>

        {/* Catalog Right Column */}
        <section className="md:col-span-9">
          <div className="flex flex-wrap items-center justify-between gap-4 md:border-b md:border-[#2E1F16] pb-2 md:pb-3 mb-4 md:mb-6">
            <div className="flex items-center justify-between w-full md:w-auto md:space-x-6 text-[13px] md:text-xs">
              {[
                { id: 'all', label: 'Todos os NFTs' },
                { id: 'new', label: 'Novos lançamentos' },
                { id: 'trending', label: 'Em alta' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setActiveTab(t.id as 'all' | 'new' | 'trending');
                    setPage(1);
                  }}
                  className={`pb-1.5 md:pb-3 md:-mb-3.5 cursor-pointer ${
                    activeTab === t.id
                      ? 'text-[#D98236] border-b-2 border-[#D98236] font-bold'
                      : 'text-[#F5EFEA] md:text-[#A3968C] hover:text-white'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="hidden md:flex items-center text-xs text-[#A3968C]">
              <span>Ordenar por:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="ml-2 bg-transparent text-white font-bold focus:outline-none cursor-pointer"
              >
                <option value="recent" className="bg-[#1C120C]">
                  Listados recentemente
                </option>
                <option value="price_asc" className="bg-[#1C120C]">
                  Menor preço
                </option>
                <option value="price_desc" className="bg-[#1C120C]">
                  Maior preço
                </option>
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div
                  key={n}
                  className="bg-[#1C120C] border border-[#2E1F16] rounded-2xl p-3 h-72 animate-pulse"
                />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="bg-[#1C120C] border border-[#2E1F16] rounded-2xl p-12 text-center space-y-3">
              <p className="text-sm font-bold text-white">Nenhum NFT encontrado para este filtro</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCollection('');
                  setSelectedNetwork('');
                  setMaxPrice('12.30');
                }}
                className="px-4 py-2 bg-[#D98236] text-[#120B07] font-bold text-xs rounded cursor-pointer"
              >
                Limpar filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-2 md:gap-6 items-start">
              {items.map((nft, index) => (
                <div
                  key={nft.id}
                  onClick={() => navigate({ to: `/nft/${nft.id}` })}
                  className={`group cursor-pointer transition-all md:bg-[#1C120C] md:border md:border-[#2E1F16] md:rounded-2xl md:p-3 md:hover:border-[#D98236] ${
                    index % 2 === 1 ? 'mt-7 md:mt-0' : ''
                  }`}
                >
                  {/* Moldura da imagem (no Mobile só a imagem fica dentro do card escuro, igual a image_d8e9c5.png) */}
                  <div className="bg-[#24160E] md:bg-transparent p-2.5 pb-3.5 md:p-0 rounded-2xl md:rounded-xl mb-2.5 md:mb-3">
                    <div className="relative aspect-[4/4.3] md:aspect-square rounded-xl overflow-hidden">
                      {nft.badge && (
                        <span className="absolute top-0 left-0 md:top-2 md:left-2 bg-[#C87D46] md:bg-[#D98236] text-[#120B07] text-[11px] md:text-[10px] font-bold px-3 py-1 md:px-2.5 md:py-0.5 rounded-br-xl md:rounded z-10">
                          {nft.badge}
                        </span>
                      )}
                      {(index === 0 || favorites.includes(nft.id)) && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            favoriteMutation.mutate(nft.id);
                          }}
                          aria-label="Favoritar"
                          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-[#24160E]/90 flex items-center justify-center text-[#D98236] z-10 cursor-pointer"
                        >
                          <Heart
                            className="w-3.5 h-3.5"
                            fill={favorites.includes(nft.id) ? '#D98236' : 'none'}
                          />
                        </button>
                      )}
                      {/* No desktop mantém o botão de favoritar em todos os cards */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          favoriteMutation.mutate(nft.id);
                        }}
                        aria-label="Favoritar"
                        className="hidden md:flex absolute top-2 right-2 w-7 h-7 rounded-full bg-[#120B07]/80 items-center justify-center text-[#D98236] z-10 cursor-pointer"
                      >
                        <Heart
                          className="w-3.5 h-3.5"
                          fill={favorites.includes(nft.id) ? '#D98236' : 'none'}
                        />
                      </button>

                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 hidden group-hover:flex items-center gap-1.5 z-10">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            quickCartMutation.mutate(nft.id);
                          }}
                          aria-label="Adicionar rápido ao carrinho"
                          className="w-7 h-7 rounded bg-[#120B07]/90 border border-[#2E1F16] text-white flex items-center justify-center hover:border-[#D98236]"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <img
                        src={nft.image}
                        alt={nft.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </div>

                  {/* Nome e Preço (Fora da caixa no Mobile e dentro no Desktop) */}
                  <h3 className="text-[13px] md:text-xs font-medium text-[#F5EFEA] truncate px-1 md:px-0">
                    {nft.name}
                  </h3>
                  <div className="mt-0.5 md:mt-1 flex items-center gap-2 text-[13px] md:text-xs px-1 md:px-0">
                    <span className="font-bold text-[#D98236]">{nft.price} ETH</span>
                    {nft.oldPrice && (
                      <span className="text-[#A3968C] line-through text-[11px]">
                        {nft.oldPrice} ETH
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="hidden md:flex justify-end items-center space-x-2 mt-8">
            {[1, 2, 3, 4].map((p) => (
              <button
                key={p}
                onClick={() => {
                  setPage(p);
                  window.scrollTo({ top: 450, behavior: 'smooth' });
                }}
                className={`w-7 h-7 rounded text-xs font-bold cursor-pointer transition-colors ${
                  page === p
                    ? 'bg-[#D98236] text-[#120B07]'
                    : 'bg-[#1C120C] border border-[#2E1F16] text-[#A3968C] hover:text-white'
                }`}
              >
                {p}
              </button>
            ))}
            <button
              aria-label="Próxima página"
              onClick={() => {
                setPage((prev) => (prev < 4 ? prev + 1 : 1));
                window.scrollTo({ top: 450, behavior: 'smooth' });
              }}
              className="w-7 h-7 rounded text-xs font-bold cursor-pointer bg-[#1C120C] border border-[#2E1F16] text-[#A3968C] hover:text-white flex items-center justify-center"
            >
              ›
            </button>
          </div>
        </section>
      </main>

      {/* Banners Promocionais (Desktop) */}
      <section className="hidden md:grid max-w-7xl mx-auto px-8 py-6 grid-cols-2 gap-6">
        <div className="bg-[#1C120C] border border-[#2E1F16] rounded-xl p-5 flex items-center gap-5">
          {items[0] && (
            <img src={items[0].image} alt="Gênesis" className="w-32 h-32 rounded-xl object-cover shrink-0" />
          )}
          <div className="space-y-2 text-right ml-auto">
            <h3 className="text-xs font-bold text-white">
              Lançamentos gênesis de edição limitada
            </h3>
            <p className="text-[11px] text-[#A3968C]">
              Colecione edições escassas diretamente dos criadores antes da revelação pública.
            </p>
            <button
              onClick={() => navigate({ to: '/nft/1' })}
              className="px-4 py-1.5 bg-[#D98236] text-[#120B07] font-bold text-xs rounded cursor-pointer"
            >
              Explorar →
            </button>
          </div>
        </div>

        <div className="bg-[#1C120C] border border-[#2E1F16] rounded-xl p-5 flex items-center gap-5">
          {items[5] && (
            <img src={items[5].image} alt="Arte digital" className="w-32 h-32 rounded-xl object-cover shrink-0" />
          )}
          <div className="space-y-2 text-right ml-auto">
            <h3 className="text-xs font-bold text-white">
              Arte digital selecionada e muito mais
            </h3>
            <p className="text-[11px] text-[#A3968C]">
              Explore novos artistas, coleções verificadas e obras digitais que definem a cultura.
            </p>
            <button
              onClick={() => navigate({ to: '/nft/6' })}
              className="px-4 py-1.5 bg-[#D98236] text-[#120B07] font-bold text-xs rounded cursor-pointer"
            >
              Explorar →
            </button>
          </div>
        </div>
      </section>

      {/* Diário da Cunhagem (Desktop) */}
      <section className="hidden md:block max-w-7xl mx-auto px-8 pt-10">
        <div className="text-center mb-8">
          <h2 className="text-lg font-bold text-white">Diário da Cunhagem</h2>
          <p className="text-xs text-[#A3968C] mt-1">
            Histórias, guias e insights para colecionadores sobre o universo da propriedade digital.
          </p>
        </div>

        <div className="grid grid-cols-4 gap-5">
          {[
            {
              date: '12 de setembro | Leitura de 6 min',
              title: 'Como funciona a propriedade de NFTs',
              desc: 'Aprenda a colecionar, negociar e verificar ativos digitais.',
              img: items[5]?.image,
            },
            {
              date: '13 de setembro | Leitura de 2 min',
              title: '10 artistas digitais para acompanhar',
              desc: 'Conheça criadores que moldam a cultura digital.',
              img: items[0]?.image,
            },
            {
              date: '15 de setembro | Leitura de 3 min',
              title: 'Raridade, atributos e procedência',
              desc: 'Entenda raridade, procedência, listas de acesso e utilidade.',
              img: items[1]?.image,
            },
            {
              date: '15 de setembro | Leitura de 2 min',
              title: 'Como proteger sua carteira',
              desc: 'Proteja sua carteira, seus ativos e sua identidade.',
              img: items[6]?.image,
            },
          ].map((post, idx) => (
            <article
              key={idx}
              className="bg-[#1C120C] border border-[#2E1F16] rounded-xl overflow-hidden flex flex-col"
            >
              {post.img && (
                <img src={post.img} alt={post.title} className="w-full h-44 object-cover" />
              )}
              <div className="p-4 space-y-2 flex-1 flex flex-col">
                <span className="text-[10px] text-[#A3968C]">{post.date}</span>
                <h3 className="text-xs font-bold text-white">{post.title}</h3>
                <p className="text-[11px] text-[#A3968C] flex-1">{post.desc}</p>
                <span className="text-[11px] font-bold text-[#D98236] pt-1">Ler mais →</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default Home;
import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Heart, ShoppingCart, SlidersHorizontal } from 'lucide-react';
import { api, type NftItem } from '../lib/api';
import { Layout } from '../components/Layout';

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

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCollection, setSelectedCollection] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState('');
  const [maxPrice, setMaxPrice] = useState('12.30');
  const [activeTab, setActiveTab] = useState<'all' | 'new' | 'trending'>('all');
  const [sortBy, setSortBy] = useState('recent');
  const [page, setPage] = useState(1);

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
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['favorites'] }),
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
      <div className="md:hidden flex items-center gap-3 px-4 pt-6 pb-4">
        <div className="flex-1 flex items-center bg-[#1C120C] border border-[#2E1F16] rounded-xl px-4 py-3">
          <Search className="w-5 h-5 text-[#A3968C] mr-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Explorar coleções"
            className="bg-transparent text-sm text-white placeholder-[#A3968C] focus:outline-none w-full"
          />
        </div>
        <button aria-label="Filtros" className="p-3.5 bg-[#D98236] text-[#120B07] rounded-xl">
          <SlidersHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 pt-2 md:pt-8">
        <div className="bg-[#1C120C] md:bg-[#170F0A] rounded-2xl p-6 md:p-10 border border-[#2E1F16] grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 space-y-4">
            <span className="text-xs text-[#F5EFEA] font-bold">Bem-vindo à Kurio</span>
            <h1 className="text-2xl md:text-4xl font-bold text-white leading-tight">
              SEJA DONO DO FUTURO DA ARTE DIGITAL
            </h1>
            <p className="text-xs text-[#A3968C] max-w-xl leading-relaxed">
              Descubra NFTs selecionados de criadores emergentes e consagrados. Colecione arte
              digital rara, apoie artistas e tenha uma parte da cultura da internet.
            </p>
            <div className="pt-2">
              <button
                onClick={() => navigate({ to: '/nft/1' })}
                className="px-6 py-2.5 bg-[#D98236] hover:bg-[#c2712b] text-[#120B07] font-bold text-xs rounded transition-colors cursor-pointer"
              >
                EXPLORAR
              </button>
            </div>
          </div>
          <div className="md:col-span-5 flex justify-center md:justify-end">
            {items[0] && (
              <img
                src={items[0].image}
                alt={items[0].name}
                className="w-56 h-56 md:w-80 md:h-80 object-cover rounded-2xl border border-[#2E1F16]"
              />
            )}
          </div>
        </div>
      </section>

      {/* Main Catalog Grid */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-10 grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Sidebar Filters */}
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
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#2E1F16] pb-3 mb-6">
            <div className="flex items-center space-x-6 text-xs">
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
                  className={`pb-3 -mb-3.5 cursor-pointer ${
                    activeTab === t.id
                      ? 'text-[#D98236] border-b-2 border-[#D98236] font-bold'
                      : 'text-[#A3968C] hover:text-white'
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
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {items.map((nft) => (
                <div
                  key={nft.id}
                  onClick={() => navigate({ to: `/nft/${nft.id}` })}
                  className="group bg-[#1C120C] border border-[#2E1F16] rounded-2xl p-3 cursor-pointer hover:border-[#D98236] transition-all"
                >
                  <div className="relative aspect-square rounded-xl overflow-hidden mb-3">
                    {nft.badge && (
                      <span className="absolute top-2 left-2 bg-[#D98236] text-[#120B07] text-[10px] font-bold px-2.5 py-0.5 rounded z-10">
                        {nft.badge}
                      </span>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        favoriteMutation.mutate(nft.id);
                      }}
                      aria-label="Favoritar"
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-[#120B07]/80 flex items-center justify-center text-[#D98236] z-10 cursor-pointer"
                    >
                      <Heart
                        className="w-3.5 h-3.5"
                        fill={favorites.includes(nft.id) ? '#D98236' : 'none'}
                      />
                    </button>

                    {/* Hover Quick Actions conforme Login.png / Cadastro.png */}
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

                  <h3 className="text-xs font-medium text-white truncate">{nft.name}</h3>
                  <div className="mt-1 flex items-center gap-2 text-xs">
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
                onClick={() => setPage(p)}
                className={`w-7 h-7 rounded text-xs font-bold cursor-pointer ${
                  page === p
                    ? 'bg-[#D98236] text-[#120B07]'
                    : 'bg-[#1C120C] border border-[#2E1F16] text-[#A3968C] hover:text-white'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </section>
      </main>

      {/* Dois Banners Promocionais conforme Início_2.png */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-6 grid grid-cols-1 md:grid-cols-2 gap-6">
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

      {/* Diário da Cunhagem conforme Início_2.png */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 pt-10">
        <div className="text-center mb-8">
          <h2 className="text-lg font-bold text-white">Diário da Cunhagem</h2>
          <p className="text-xs text-[#A3968C] mt-1">
            Histórias, guias e insights para colecionadores sobre o universo da propriedade digital.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
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
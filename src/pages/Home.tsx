import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Search, ShoppingCart, Heart, Home as HomeIcon, User, SlidersHorizontal, Scan } from 'lucide-react';

interface NftItem {
  id: string;
  name: string;
  price: string;
  oldPrice?: string;
  collection: string;
  network: string;
  badge?: string;
  image: string;
}

const NFTS_MOCK: NftItem[] = [
  {
    id: '1',
    name: 'Emerald Ape #042',
    price: '1.19',
    collection: 'Arte digital',
    network: 'Ethereum',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: '2',
    name: 'Sage Nomad #009',
    price: '1.69',
    collection: 'Arte 3D',
    network: 'Ethereum',
    image: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: '3',
    name: 'Neon Vessel #552',
    price: '1.99',
    oldPrice: '2.29',
    collection: 'Arte digital',
    network: 'Polygon',
    badge: 'RARO',
    image: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: '4',
    name: 'Cosmic Bloom #118',
    price: '1.29',
    collection: 'Colecionáveis',
    network: 'Ethereum',
    image: 'https://images.unsplash.com/photo-1635322966219-b75ed372eb01?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: '5',
    name: 'Violet Nomad #314',
    price: '1.39',
    collection: 'Generativa',
    network: 'Solana',
    image: 'https://images.unsplash.com/photo-1618172193622-ae2d025f4032?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: '6',
    name: 'Ivory Baron #088',
    price: '1.79',
    collection: 'Arte 3D',
    network: 'Ethereum',
    image: 'https://images.unsplash.com/photo-1642104704074-907c0698cbd9?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: '7',
    name: 'Golden Beat #207',
    price: '0.99',
    collection: 'Música',
    network: 'Polygon',
    image: 'https://images.unsplash.com/photo-1614680376593-902f749f7ffc?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: '8',
    name: 'Golden Signal #160',
    price: '0.39',
    collection: 'Jogos',
    network: 'Solana',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
  },
];

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
  const [activeTab, setActiveTab] = useState('Todos os NFTs');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [selectedNetwork, setSelectedNetwork] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredNfts = NFTS_MOCK.filter((nft) => {
    const matchesSearch = nft.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCollection = !selectedCollection || nft.collection === selectedCollection;
    const matchesNetwork = !selectedNetwork || nft.network === selectedNetwork;
    return matchesSearch && matchesCollection && matchesNetwork;
  });

  return (
    <div className="min-h-screen bg-[#120B07] text-[#F5EFEA] font-mono pb-24 md:pb-0">
      {/* Desktop Navbar */}
      <header className="hidden md:flex items-center justify-between max-w-7xl mx-auto px-8 py-6 border-b border-[#261810]">
        <div className="text-lg font-bold tracking-widest text-white cursor-pointer" onClick={() => navigate({ to: '/' })}>
          KURIO
        </div>
        <nav className="flex items-center space-x-8 text-sm">
          <button className="text-[#D98236] border-b-2 border-[#D98236] pb-1 font-medium">
            Início
          </button>
          <button className="text-[#A3968C] hover:text-white transition-colors">Mercado</button>
          <button className="text-[#A3968C] hover:text-white transition-colors">Criadores</button>
          <button className="text-[#A3968C] hover:text-white transition-colors">Aprenda</button>
        </nav>
        <div className="flex items-center space-x-5">
          <button aria-label="Buscar" className="text-[#F5EFEA] hover:text-[#D98236]">
            <Search className="w-5 h-5" />
          </button>
          <button
            aria-label="Carrinho"
            onClick={() => navigate({ to: '/cart' })}
            className="relative text-[#F5EFEA] hover:text-[#D98236]"
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="absolute -top-2 -right-2 bg-[#D98236] text-[#120B07] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              0
            </span>
          </button>
          <button
            onClick={() => navigate({ to: '/login' })}
            className="px-4 py-1.5 bg-[#D98236] hover:bg-[#c2712b] text-[#120B07] font-bold text-xs rounded transition-colors"
          >
            [→ Entrar
          </button>
        </div>
      </header>

      {/* Mobile Top Search Bar */}
      <div className="md:hidden flex items-center gap-3 px-4 pt-6 pb-4">
        <div className="flex-1 flex items-center bg-[#1C120C] border border-[#2E1F16] rounded-xl px-4 py-3">
          <Search className="w-5 h-5 text-[#A3968C] mr-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Explorar coleções"
            className="bg-transparent text-sm text-white placeholder-[#A3968C] focus:outline-none w-full"
          />
        </div>
        <button
          aria-label="Filtros"
          className="p-3.5 bg-[#D98236] text-[#120B07] rounded-xl"
        >
          <SlidersHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 pt-2 md:pt-10">
        <div className="bg-[#1C120C] md:bg-transparent rounded-2xl p-6 md:p-0 border border-[#2E1F16] md:border-none grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 space-y-4">
            <span className="text-xs text-[#A3968C] uppercase tracking-wider">
              Bem-vindo à Kurio
            </span>
            <h1 className="text-2xl md:text-5xl font-bold text-white leading-tight">
              SEJA DONO DO FUTURO DA ARTE DIGITAL
            </h1>
            <p className="text-xs md:text-sm text-[#A3968C] max-w-xl leading-relaxed">
              Descubra NFTs selecionados de criadores emergentes e consagrados.
              Colecione arte digital rara, apoie artistas e tenha uma parte da cultura da internet.
            </p>
            <div className="pt-2">
              <button className="px-6 py-2.5 bg-[#D98236] hover:bg-[#c2712b] text-[#120B07] font-bold text-xs rounded transition-colors">
                EXPLORAR
              </button>
            </div>
          </div>
          <div className="md:col-span-5 flex justify-center md:justify-end">
            <img
              src={NFTS_MOCK[0].image}
              alt="Featured Ape NFT"
              className="w-48 h-48 md:w-96 md:h-96 object-cover rounded-2xl border border-[#2E1F16]"
            />
          </div>
        </div>
      </section>

      {/* Main Content: Sidebar + Catalog Grid */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-16 grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden md:block md:col-span-3 space-y-6">
          <div className="bg-[#1C120C] border border-[#2E1F16] rounded-xl p-5 space-y-6">
            {/* Coleções */}
            <div>
              <h3 className="text-sm font-bold text-white mb-4">Coleções</h3>
              <ul className="space-y-2.5 text-xs">
                {COLLECTIONS.map((col) => {
                  const isSelected = selectedCollection === col.name;
                  return (
                    <li key={col.name}>
                      <button
                        onClick={() =>
                          setSelectedCollection(isSelected ? null : col.name)
                        }
                        className={`w-full flex justify-between items-center transition-colors ${
                          isSelected
                            ? 'text-[#D98236] font-bold'
                            : 'text-[#A3968C] hover:text-white'
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

            {/* Faixa de preço */}
            <div className="border-t border-[#2E1F16] pt-5">
              <h3 className="text-sm font-bold text-white mb-3">Faixa de preço</h3>
              <input
                type="range"
                min="0.02"
                max="12.30"
                step="0.1"
                className="w-full accent-[#D98236]"
              />
              <p className="text-[11px] text-[#A3968C] mt-2">Preço: 0,02 - 12,30 ETH</p>
              <button className="mt-3 px-4 py-1.5 bg-[#D98236] text-[#120B07] font-bold text-xs rounded">
                Aplicar
              </button>
            </div>

            {/* Rede */}
            <div className="border-t border-[#2E1F16] pt-5">
              <h3 className="text-sm font-bold text-white mb-4">Rede</h3>
              <ul className="space-y-2.5 text-xs">
                {NETWORKS.map((net) => {
                  const isSelected = selectedNetwork === net.name;
                  return (
                    <li key={net.name}>
                      <button
                        onClick={() =>
                          setSelectedNetwork(isSelected ? null : net.name)
                        }
                        className={`w-full flex justify-between items-center ${
                          isSelected
                            ? 'text-[#D98236] font-bold'
                            : 'text-[#A3968C] hover:text-white'
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

          {/* NFT em Destaque Banner */}
          <div className="bg-[#1C120C] border border-[#2E1F16] rounded-xl p-5">
            <p className="text-xs font-bold text-[#D98236] uppercase">NFT EM DESTAQUE</p>
            <p className="text-sm font-bold text-white mt-1 mb-4">OFERTA LIMITADA</p>
            <img
              src={NFTS_MOCK[1].image}
              alt="Oferta Limitada"
              className="w-full h-56 object-cover rounded-xl"
            />
          </div>
        </aside>

        {/* Catalog Right Column */}
        <section className="md:col-span-9">
          {/* Tabs & Sort */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#2E1F16] pb-3 mb-6">
            <div className="flex items-center space-x-6 text-xs md:text-sm">
              {['Todos os NFTs', 'Novos lançamentos', 'Em alta'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 -mb-3.5 transition-colors ${
                    activeTab === tab
                      ? 'text-[#D98236] border-b-2 border-[#D98236] font-bold'
                      : 'text-[#A3968C] hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="hidden md:flex items-center text-xs text-[#A3968C]">
              <span>Ordenar por:</span>
              <select className="ml-2 bg-transparent text-white font-medium focus:outline-none">
                <option className="bg-[#1C120C]">Listados recentemente</option>
                <option className="bg-[#1C120C]">Menor preço</option>
                <option className="bg-[#1C120C]">Maior preço</option>
              </select>
            </div>
          </div>

          {/* NFT Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredNfts.map((nft) => (
              <div
                key={nft.id}
                onClick={() => navigate({ to: `/nft/${nft.id}` })}
                className="group bg-[#1C120C] border border-[#2E1F16] rounded-2xl p-3 cursor-pointer hover:border-[#D98236] transition-all"
              >
                <div className="relative aspect-square rounded-xl overflow-hidden mb-3">
                  {nft.badge && (
                    <span className="absolute top-2 left-2 bg-[#D98236] text-[#120B07] text-[10px] font-bold px-2.5 py-1 rounded">
                      {nft.badge}
                    </span>
                  )}
                  <button
                    onClick={(e) => toggleFavorite(nft.id, e)}
                    aria-label="Favoritar"
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-[#120B07]/80 flex items-center justify-center text-[#D98236] hover:bg-[#120B07]"
                  >
                    <Heart
                      className="w-4 h-4"
                      fill={favorites.includes(nft.id) ? '#D98236' : 'none'}
                    />
                  </button>
                  <img
                    src={nft.image}
                    alt={nft.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-xs md:text-sm font-medium text-white truncate">
                  {nft.name}
                </h3>
                <div className="mt-1 flex items-center gap-2 text-xs md:text-sm">
                  <span className="font-bold text-[#D98236]">{nft.price} ETH</span>
                  {nft.oldPrice && (
                    <span className="text-[#A3968C] line-through text-xs">
                      {nft.oldPrice} ETH
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="hidden md:flex justify-end items-center space-x-2 mt-10">
            {[1, 2, 3, 4].map((page) => (
              <button
                key={page}
                className={`w-8 h-8 rounded text-xs font-bold ${
                  page === 1
                    ? 'bg-[#D98236] text-[#120B07]'
                    : 'bg-[#1C120C] border border-[#2E1F16] text-[#A3968C] hover:text-white'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        </section>
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#1C120C] border-t border-[#2E1F16] px-6 py-3 flex items-center justify-between z-50">
        <button onClick={() => navigate({ to: '/' })} className="text-[#D98236]">
          <HomeIcon className="w-6 h-6" />
        </button>
        <button className="text-[#A3968C]">
          <Heart className="w-6 h-6" />
        </button>
        <div className="-mt-8 bg-[#D98236] p-3.5 rounded-full text-[#120B07] shadow-lg">
          <Scan className="w-6 h-6" />
        </div>
        <button onClick={() => navigate({ to: '/cart' })} className="text-[#A3968C]">
          <ShoppingCart className="w-6 h-6" />
        </button>
        <button onClick={() => navigate({ to: '/profile' })} className="text-[#A3968C]">
          <User className="w-6 h-6" />
        </button>
      </nav>
    </div>
  );
};

export default Home;
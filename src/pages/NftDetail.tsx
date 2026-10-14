import { useState } from 'react';
import { useParams, useNavigate, useLocation } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Heart, Search, Star, ChevronLeft, ShoppingCart } from 'lucide-react';
import { api, type NftItem } from '../lib/api';
import { Layout } from '../components/Layout';

const NftDetail = () => {
  const params = useParams({ strict: false }) as { id?: string };
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Garante extrair o ID tanto pelo TanStack Router quanto pela URL direta (/nft/3)
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const resolvedId = params?.id || pathSegments[pathSegments.length - 1] || '1';

  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [selectedEdition, setSelectedEdition] = useState<'1/1' | '1/10' | '1/50' | 'ABERTA'>('1/50');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');
  const [feedback, setFeedback] = useState('');

  const { data, isLoading, isError } = useQuery<{ nft: NftItem; related: NftItem[] }>({
    queryKey: ['nft', resolvedId],
    queryFn: async () => (await api.get(`/nfts/${resolvedId}`)).data,
    retry: 1,
  });

  const { data: favData } = useQuery<{ favorites: string[] }>({
    queryKey: ['favorites'],
    queryFn: async () => (await api.get('/favorites')).data,
  });

  const addToCartMutation = useMutation({
    mutationFn: async () =>
      (
        await api.post('/cart/items', {
          nftId: data?.nft.id,
          edition: selectedEdition,
          quantity,
        })
      ).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      navigate({ to: '/cart' });
    },
    onError: (err: any) => {
      setFeedback(err?.response?.data?.message || 'Erro ao adicionar ao carrinho.');
    },
  });

  const favoriteMutation = useMutation({
    mutationFn: async (nftId: string) => (await api.post(`/favorites/${nftId}`)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 animate-pulse space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-6 h-105 bg-[#1C120C] rounded-2xl" />
            <div className="md:col-span-6 space-y-4">
              <div className="h-8 w-64 bg-[#1C120C] rounded" />
              <div className="h-6 w-32 bg-[#1C120C] rounded" />
              <div className="h-24 w-full bg-[#1C120C] rounded" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (isError || !data?.nft) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
          <h1 className="text-2xl font-bold text-white">NFT não encontrado</h1>
          <p className="text-xs text-[#A3968C]">
            O colecionável solicitado não existe ou foi removido do catálogo.
          </p>
          <button
            onClick={() => navigate({ to: '/' })}
            className="px-6 py-2.5 bg-[#D98236] text-[#120B07] font-bold text-xs rounded"
          >
            Voltar ao início
          </button>
        </div>
      </Layout>
    );
  }

  const { nft, related } = data;
  const isFavorited = favData?.favorites?.includes(nft.id) ?? false;
  const currentEditionObj =
    nft.editions.find((e) => e.label === selectedEdition) || nft.editions[0];
  const galleryList = nft.gallery?.length ? nft.gallery : [nft.image];

  return (
    <Layout>
      {/* Mobile Header Buttons (< e Heart) conforme Detalhes do NFTMobile.png */}
      <div className="md:hidden flex items-center justify-between px-4 pt-5 pb-3">
        <button
          onClick={() => navigate({ to: '/' })}
          aria-label="Voltar"
          className="w-10 h-10 rounded-full bg-[#1C120C] border border-[#2E1F16] flex items-center justify-center text-[#D98236]"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => favoriteMutation.mutate(nft.id)}
          aria-label="Favoritar"
          className="w-10 h-10 rounded-full bg-[#1C120C] border border-[#2E1F16] flex items-center justify-center text-[#D98236]"
        >
          <Heart className="w-5 h-5" fill={isFavorited ? '#D98236' : 'none'} />
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-2 md:py-6">
        {/* Desktop Breadcrumb */}
        <nav className="hidden md:block text-xs text-[#A3968C] mb-6">
          <button onClick={() => navigate({ to: '/' })} className="hover:text-white font-bold text-white">
            Início
          </button>
          <span className="mx-2">/</span>
          <span>Mercado</span>
        </nav>

        {/* Top Section: Gallery + Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Thumbnails + Main Image */}
          <div className="lg:col-span-6 flex flex-col-reverse md:flex-row gap-4">
            <div className="hidden md:flex md:flex-col gap-3">
              {[0, 1, 2, 3].map((idx) => {
                const imgSrc = galleryList[idx % galleryList.length];
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIdx(idx)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 bg-[#1C120C] shrink-0 cursor-pointer ${
                      selectedImageIdx === idx ? 'border-[#D98236]' : 'border-[#2E1F16]'
                    }`}
                  >
                    <img src={imgSrc} alt={`${nft.name} miniatura ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                );
              })}
            </div>

            <div className="relative flex-1 bg-[#1C120C] border border-[#2E1F16] rounded-3xl p-2 md:p-4">
              <button
                aria-label="Ampliar imagem"
                className="hidden md:flex absolute top-6 right-6 w-8 h-8 rounded-full bg-[#120B07]/80 text-white items-center justify-center"
              >
                <Search className="w-4 h-4" />
              </button>
              <img
                src={galleryList[selectedImageIdx % galleryList.length]}
                alt={nft.name}
                className="w-full aspect-square object-cover rounded-2xl"
              />
            </div>
          </div>

          {/* Right Details / Mobile Sheet */}
          <div className="lg:col-span-6 bg-[#1C120C] md:bg-transparent border border-[#2E1F16] md:border-none rounded-3xl p-5 md:p-0 space-y-5">
            <div>
              <div className="flex items-center justify-between gap-2">
                <h1 className="text-xl md:text-3xl font-bold text-white">{nft.name}</h1>
                {/* Mobile Rating Pill */}
                <div className="md:hidden flex items-center gap-1 px-2.5 py-1 rounded-full border border-[#D98236] text-xs">
                  <Star className="w-3.5 h-3.5 fill-[#D98236] text-[#D98236]" />
                  <span className="text-white font-bold">{nft.rating}</span>
                  <span className="text-[#A3968C]">({nft.reviewsCount})</span>
                </div>
              </div>

              <div className="hidden md:flex flex-wrap items-center justify-between gap-4 pb-3 mt-2 border-b border-[#2E1F16]">
                <span className="text-lg font-bold text-[#D98236]">{nft.price} ETH</span>
                <div className="flex items-center gap-1.5 text-xs text-[#A3968C]">
                  <div className="flex text-[#D98236]">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-3.5 h-3.5 fill-[#D98236]" />
                    ))}
                  </div>
                  <span>{nft.reviewsCount} avaliações de colecionadores</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="hidden md:block text-xs font-bold text-white">Sobre este NFT:</h2>
              <p className="text-xs text-[#A3968C] leading-relaxed">{nft.description}</p>
            </div>

            {/* Edição */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-white">Edição:</h3>
              <div className="flex flex-wrap gap-2">
                {nft.editions.map((ed) => {
                  const isSelected = selectedEdition === ed.label;
                  const isOut = ed.available === 0;
                  return (
                    <button
                      key={ed.label}
                      disabled={isOut}
                      onClick={() => {
                        setSelectedEdition(ed.label);
                        setQuantity(1);
                      }}
                      className={`px-3 py-1 rounded-full text-[11px] border transition-colors cursor-pointer ${
                        isSelected
                          ? 'border-[#D98236] text-[#D98236] font-bold bg-[#D98236]/10'
                          : 'border-[#2E1F16] text-[#A3968C] hover:text-white'
                      } ${isOut ? 'opacity-40 cursor-not-allowed line-through' : ''}`}
                    >
                      {ed.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {feedback && (
              <p className="text-xs text-red-400 bg-red-950/40 border border-red-800 rounded p-2">
                {feedback}
              </p>
            )}

            {/* Metadata */}
            <div className="space-y-1.5 text-xs text-[#A3968C] pt-1">
              <p>ID do token: {nft.tokenId}</p>
              <p>Coleção: Kurio Apes</p>
              <p>Atributos: {nft.attributes.join(', ')}</p>
              <p className="hidden md:block text-white font-bold pt-1">
                Compartilhar este NFT: <span className="text-[#A3968C] font-normal ml-2">in  ✉  🐦</span>
              </p>
            </div>

            {/* Desktop Quantity + Actions */}
            <div className="hidden md:flex flex-wrap items-center gap-4 pt-1">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-7 h-9 rounded-full bg-[#D98236] text-[#120B07] font-bold flex items-center justify-center cursor-pointer"
                >
                  -
                </button>
                <span className="text-sm font-bold text-white w-4 text-center">{quantity}</span>
                <button
                  onClick={() =>
                    setQuantity((q) => Math.min(currentEditionObj.available || 1, q + 1))
                  }
                  className="w-7 h-9 rounded-full bg-[#D98236] text-[#120B07] font-bold flex items-center justify-center cursor-pointer"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => addToCartMutation.mutate()}
                disabled={addToCartMutation.isPending || currentEditionObj.available === 0}
                className="px-7 py-2.5 bg-[#D98236] hover:bg-[#c2712b] text-[#120B07] font-bold text-xs rounded transition-colors cursor-pointer disabled:opacity-50"
              >
                {addToCartMutation.isPending ? 'ADICIONANDO...' : 'COMPRAR'}
              </button>

              <button
                onClick={() => favoriteMutation.mutate(nft.id)}
                className={`px-4 py-2.5 border rounded text-xs flex items-center gap-2 transition-colors cursor-pointer ${
                  isFavorited
                    ? 'border-[#D98236] text-[#D98236]'
                    : 'border-[#3E271B] text-[#F5EFEA] hover:border-[#D98236]'
                }`}
              >
                <Heart className="w-3.5 h-3.5" fill={isFavorited ? '#D98236' : 'none'} />
                Favoritar
              </button>
            </div>

            {/* Mobile Bottom Action Panel conforme Detalhes do NFTMobile.png */}
            <div className="md:hidden pt-4 border-t border-[#2E1F16] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs text-[#A3968C]">Qtd.</span>
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-6 h-8 rounded-full bg-[#D98236] text-[#120B07] font-bold flex items-center justify-center"
                  >
                    -
                  </button>
                  <span className="text-sm font-bold text-white px-1">{quantity}</span>
                  <button
                    onClick={() =>
                      setQuantity((q) => Math.min(currentEditionObj.available || 1, q + 1))
                    }
                    className="w-6 h-8 rounded-full bg-[#D98236] text-[#120B07] font-bold flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
                <span className="text-lg font-bold text-[#D98236]">{nft.price} ETH</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => addToCartMutation.mutate()}
                  disabled={addToCartMutation.isPending || currentEditionObj.available === 0}
                  className="flex-1 py-3.5 bg-[#D98236] text-[#120B07] font-bold text-sm rounded-full"
                >
                  Comprar NFT
                </button>
                <button
                  onClick={() => addToCartMutation.mutate()}
                  aria-label="Adicionar ao carrinho"
                  className="w-12 h-12 rounded-full bg-[#261810] border border-[#3E271B] text-[#D98236] flex items-center justify-center"
                >
                  <ShoppingCart className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Tabs & Related */}
        <div className="hidden md:block mt-14">
          <div className="flex space-x-8 border-b border-[#2E1F16] text-xs mb-6">
            <button
              onClick={() => setActiveTab('details')}
              className={`pb-3 font-bold cursor-pointer ${
                activeTab === 'details'
                  ? 'text-[#D98236] border-b-2 border-[#D98236]'
                  : 'text-[#A3968C]'
              }`}
            >
              Detalhes do NFT
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-3 font-bold cursor-pointer ${
                activeTab === 'reviews'
                  ? 'text-[#D98236] border-b-2 border-[#D98236]'
                  : 'text-[#A3968C]'
              }`}
            >
              Avaliações de colecionadores ({nft.reviewsCount})
            </button>
          </div>

          {activeTab === 'details' ? (
            <div className="space-y-4 text-xs text-[#A3968C] leading-relaxed">
              <p>
                {nft.name} é uma obra digital 1/50 finalizada à mão da coleção Kurio Editions.
                Cada atributo fica armazenado nos metadados do token e verificado na {nft.network}.
              </p>
              <div>
                <h4 className="text-white font-bold mb-1">Rede:</h4>
                <p>Cunhado na {nft.network} com procedência imutável e metadados armazenados no IPFS.</p>
              </div>
              <div>
                <h4 className="text-white font-bold mb-1">Direitos autorais:</h4>
                <p>0x7A42...19E8 • Contrato inteligente ERC-721 verificado.</p>
              </div>
            </div>
          ) : (
            <div className="bg-[#1C120C] border border-[#2E1F16] rounded-xl p-6 text-xs text-[#A3968C]">
              <p className="text-white font-bold">Colecionador verificado (0x89A...44B1)</p>
              <p>“Arte impecável e metadados verificados instantaneamente na carteira.”</p>
            </div>
          )}
        </div>

        <div className="hidden md:block mt-14">
          <h3 className="text-sm font-bold text-[#D98236] border-b border-[#2E1F16] pb-3 mb-6">
            Mais desta coleção
          </h3>
          <div className="grid grid-cols-5 gap-4">
            {related.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate({ to: `/nft/${item.id}` })}
                className="bg-[#1C120C] border border-[#2E1F16] rounded-xl p-2.5 cursor-pointer hover:border-[#D98236]"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full aspect-square object-cover rounded-lg mb-2.5"
                />
                <p className="text-[11px] text-white truncate">{item.name}</p>
                <p className="text-[11px] font-bold text-[#D98236] mt-0.5">{item.price} ETH</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NftDetail;
import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash2 } from 'lucide-react';
import { api, type QuoteSummary, type NftItem } from '../lib/api';
import { Layout } from '../components/Layout';

const Cart = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  const { data: quote, isLoading } = useQuery<QuoteSummary>({
    queryKey: ['cart'],
    queryFn: async () => (await api.get('/cart')).data,
  });

  const { data: catalogData } = useQuery<{ items: NftItem[] }>({
    queryKey: ['nfts-recommendations'],
    queryFn: async () => (await api.get('/nfts?pageSize=5')).data,
  });

  const updateQtyMutation = useMutation({
    mutationFn: async ({ nftId, quantity }: { nftId: string; quantity: number }) =>
      (await api.patch(`/cart/items/${nftId}`, { quantity })).data,
    onSuccess: (data) => queryClient.setQueryData(['cart'], data),
  });

  const removeMutation = useMutation({
    mutationFn: async (nftId: string) => (await api.delete(`/cart/items/${nftId}`)).data,
    onSuccess: (data) => queryClient.setQueryData(['cart'], data),
  });

  const couponMutation = useMutation({
    mutationFn: async (code: string) => (await api.post('/cart/coupon', { code })).data,
    onSuccess: (data) => {
      setCouponError('');
      queryClient.setQueryData(['cart'], data);
    },
    onError: (err: any) => {
      setCouponError(err?.response?.data?.message || 'Cupom inválido.');
    },
  });

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
        {/* Breadcrumb */}
        <nav className="text-xs text-[#A3968C] mb-6">
          <button onClick={() => navigate({ to: '/' })} className="text-white font-bold">
            Início
          </button>
          <span className="mx-2">/</span>
          <span>Mercado</span>
          <span className="mx-2">/</span>
          <span className="text-white font-bold">Carrinho</span>
        </nav>

        {isLoading || !quote ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-pulse">
            <div className="lg:col-span-8 h-64 bg-[#1C120C] rounded-xl" />
            <div className="lg:col-span-4 h-64 bg-[#1C120C] rounded-xl" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Table */}
            <div className="lg:col-span-8">
              <div className="hidden md:grid grid-cols-12 text-xs font-bold text-white border-b border-[#2E1F16] pb-3 mb-4">
                <div className="col-span-5">NFTs</div>
                <div className="col-span-2">Preço</div>
                <div className="col-span-3">Edições</div>
                <div className="col-span-2">Total</div>
              </div>

              {quote.items.length === 0 ? (
                <div className="bg-[#1C120C] border border-[#2E1F16] rounded-xl p-10 text-center space-y-4">
                  <p className="text-sm text-white font-bold">Seu carrinho de NFTs está vazio</p>
                  <button
                    onClick={() => navigate({ to: '/' })}
                    className="px-6 py-2.5 bg-[#D98236] text-[#120B07] font-bold text-xs rounded cursor-pointer"
                  >
                    Explorar catálogo
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {quote.items.map((item) => {
                    const lineTotal = (parseFloat(item.nft.price) * item.quantity).toFixed(2);
                    return (
                      <div
                        key={`${item.nftId}-${item.edition}`}
                        className="bg-[#1C120C] border border-[#2E1F16] rounded-lg p-3 grid grid-cols-1 md:grid-cols-12 items-center gap-4 text-xs"
                      >
                        <div className="md:col-span-5 flex items-center gap-3">
                          <img
                            src={item.nft.image}
                            alt={item.nft.name}
                            className="w-14 h-14 rounded-lg object-cover shrink-0"
                          />
                          <div>
                            <p className="font-bold text-white">{item.nft.name}</p>
                            <p className="text-[11px] text-[#A3968C]">
                              ID do token: {item.nft.tokenId}
                            </p>
                          </div>
                        </div>

                        <div className="md:col-span-2 text-[#A3968C] font-bold">
                          {item.nft.price} ETH
                        </div>

                        <div className="md:col-span-3 flex items-center gap-2.5">
                          <button
                            onClick={() =>
                              updateQtyMutation.mutate({
                                nftId: item.nftId,
                                quantity: item.quantity - 1,
                              })
                            }
                            className="w-5 h-7 rounded-full bg-[#D98236] text-[#120B07] font-bold flex items-center justify-center cursor-pointer"
                          >
                            -
                          </button>
                          <span className="w-5 text-center text-white font-bold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQtyMutation.mutate({
                                nftId: item.nftId,
                                quantity: item.quantity + 1,
                              })
                            }
                            className="w-5 h-7 rounded-full bg-[#D98236] text-[#120B07] font-bold flex items-center justify-center cursor-pointer"
                          >
                            +
                          </button>
                        </div>

                        <div className="md:col-span-2 flex items-center justify-between">
                          <span className="font-bold text-[#D98236]">{lineTotal} ETH</span>
                          <button
                            aria-label="Remover item"
                            onClick={() => removeMutation.mutate(item.nftId)}
                            className="text-[#A3968C] hover:text-red-400 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right Wallet Summary */}
            <div className="lg:col-span-4 space-y-4">
              <h2 className="text-sm font-bold text-white border-b border-[#2E1F16] pb-3">
                Resumo da carteira
              </h2>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-white">Código promocional</label>
                <div className="flex">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="Digite o código promocional..."
                    className="bg-[#120B07] border border-[#D98236]/50 rounded-l px-3 py-2 text-xs text-white w-full focus:outline-none"
                  />
                  <button
                    onClick={() => couponMutation.mutate(couponInput)}
                    className="bg-[#D98236] hover:bg-[#c2712b] text-[#120B07] font-bold text-xs px-4 py-2 rounded-r cursor-pointer"
                  >
                    Aplicar
                  </button>
                </div>
                {couponError && <p className="text-[11px] text-red-400">{couponError}</p>}
                {quote.coupon && (
                  <p className="text-[11px] text-green-400">
                    Cupom {quote.coupon} ativo!{' '}
                    <button
                      onClick={() => {
                        setCouponInput('');
                        couponMutation.mutate('');
                      }}
                      className="underline ml-1"
                    >
                      Remover
                    </button>
                  </p>
                )}
              </div>

              <div className="space-y-2.5 text-xs pt-2">
                <div className="flex justify-between text-[#A3968C]">
                  <span>Subtotal</span>
                  <span className="text-white">{quote.subtotal} ETH</span>
                </div>
                <div className="flex justify-between text-[#A3968C]">
                  <span>Desconto do lançamento</span>
                  <span className="text-white">(-) {quote.discount}</span>
                </div>
                <div className="flex justify-between text-[#A3968C]">
                  <span>Taxa de rede</span>
                  <span className="text-white">{quote.networkFee} ETH</span>
                </div>
                <div className="text-right text-[10px] text-[#D98236]">Taxa estimada</div>

                <div className="flex justify-between text-sm font-bold pt-2 border-t border-[#2E1F16]">
                  <span className="text-white">Total</span>
                  <span className="text-[#D98236]">{quote.total} ETH</span>
                </div>
              </div>

              <button
                disabled={quote.items.length === 0}
                onClick={() => navigate({ to: '/payment' })}
                className="w-full py-2.5 bg-[#D98236] hover:bg-[#c2712b] text-[#120B07] font-bold text-xs rounded transition-colors cursor-pointer disabled:opacity-40"
              >
                Conectar e finalizar
              </button>

              <div className="text-center">
                <button
                  onClick={() => navigate({ to: '/' })}
                  className="text-xs text-[#D98236] hover:underline cursor-pointer"
                >
                  Continuar explorando
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Colecionadores também viram */}
        <div className="mt-16">
          <h3 className="text-sm font-bold text-[#D98236] border-b border-[#2E1F16] pb-3 mb-6">
            Colecionadores também viram
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {catalogData?.items?.slice(3, 8).map((item) => (
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

export default Cart;
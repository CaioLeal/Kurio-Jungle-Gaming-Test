import { useNavigate } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { X, MailCheck } from 'lucide-react';
import { api, type OrderReceipt } from '../lib/api';

const OrderConfirmation = () => {
  const navigate = useNavigate();

  const { data } = useQuery<{ order: OrderReceipt | null }>({
    queryKey: ['latest-order'],
    queryFn: async () => (await api.get('/orders/latest')).data,
  });

  const order: OrderReceipt = data?.order || {
    id: 'ord_demo',
    txHash: '0xA91F..E82C',
    status: 'confirmed',
    createdAt: '29 Jul, 2026',
    walletProvider: 'MetaMask',
    network: 'Ethereum',
    items: [
      {
        nftId: '1',
        name: 'Emerald Ape #042',
        tokenId: '#0042',
        image: '',
        edition: '1/50',
        quantity: 2,
        unitPrice: '1.19',
        subtotal: '2.38',
      },
      {
        nftId: '5',
        name: 'Violet Nomad #314',
        tokenId: '#0314',
        image: '',
        edition: '1/50',
        quantity: 6,
        unitPrice: '1.39',
        subtotal: '8.34',
      },
      {
        nftId: '6',
        name: 'Ivory Baron #088',
        tokenId: '#0088',
        image: '',
        edition: '1/50',
        quantity: 9,
        unitPrice: '1.79',
        subtotal: '16.11',
      },
    ],
    subtotal: '26.83',
    discount: '0.00',
    networkFee: '0.016',
    total: '26.846',
  };

  return (
    <div className="min-h-screen bg-[#120B07] text-[#F5EFEA] font-mono flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-[#1C120C] border border-[#2E1F16] border-b-4 border-b-[#D98236] rounded-xl p-6 md:p-8 shadow-2xl">
        <button
          onClick={() => navigate({ to: '/' })}
          aria-label="Fechar"
          className="absolute top-4 right-4 text-[#A3968C] hover:text-white cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Icon */}
        <div className="text-center space-y-2 pb-5 border-b border-[#2E1F16]">
          <div className="w-14 h-14 mx-auto rounded-xl border border-[#D98236] flex flex-col items-center justify-center text-[#D98236]">
            <span className="text-[8px] font-bold leading-none">THANK</span>
            <span className="text-[8px] font-bold leading-none mb-0.5">YOU</span>
            <MailCheck className="w-5 h-5" />
          </div>
          <h1 className="text-xs font-bold text-white pt-1">
            Seus NFTs agora estão na sua carteira
          </h1>
        </div>

        {/* Metadata 4 Columns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-b border-[#2E1F16] text-[10px]">
          <div className="sm:border-r sm:border-[#2E1F16] pr-2">
            <p className="text-[#A3968C] font-bold">ID da transação</p>
            <p className="text-white mt-0.5">{order.txHash}</p>
          </div>
          <div className="sm:border-r sm:border-[#2E1F16] pr-2">
            <p className="text-[#A3968C] font-bold">Data</p>
            <p className="text-white mt-0.5">{order.createdAt}</p>
          </div>
          <div className="sm:border-r sm:border-[#2E1F16] pr-2">
            <p className="text-[#A3968C] font-bold">Total</p>
            <p className="text-white mt-0.5">{order.total} ETH</p>
          </div>
          <div>
            <p className="text-[#A3968C] font-bold">Carteira</p>
            <p className="text-white mt-0.5">{order.walletProvider}</p>
          </div>
        </div>

        {/* Transaction Details */}
        <div className="py-4 space-y-3 text-xs">
          <p className="font-bold text-white">Detalhes da transação</p>
          <div className="flex justify-between text-[11px] font-bold text-white border-b border-[#2E1F16] pb-2">
            <span>NFTs</span>
            <div className="flex gap-8">
              <span>Edições</span>
              <span>Subtotal</span>
            </div>
          </div>

          <div className="space-y-3">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-11 h-11 rounded object-cover" />
                  ) : (
                    <div className="w-11 h-11 rounded bg-[#261810] border border-[#3E271B]" />
                  )}
                  <div>
                    <p className="font-bold text-white">{item.name}</p>
                    <p className="text-[10px] text-[#A3968C]">ID do token: {item.tokenId}</p>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <span className="text-[#A3968C]">(x {item.quantity})</span>
                  <span className="font-bold text-[#D98236] w-20 text-right">
                    {item.subtotal} ETH
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-[#2E1F16] pt-3 space-y-1.5 text-xs">
            <div className="flex justify-end gap-12">
              <span className="text-white">Taxa de rede</span>
              <span className="text-white w-24 text-right">{order.networkFee} ETH</span>
            </div>
            <div className="flex justify-end gap-12 font-bold">
              <span className="text-white">Total</span>
              <span className="text-[#D98236] w-24 text-right">{order.total} ETH</span>
            </div>
          </div>
        </div>

        <p className="text-center text-[11px] text-[#A3968C] leading-relaxed border-t border-[#2E1F16] pt-4 mb-5">
          Transação confirmada na {order.network}. A propriedade foi transferida para sua
          carteira conectada e registrada na rede.
        </p>

        <div className="text-center">
          <button
            onClick={() => navigate({ to: '/' })}
            className="px-6 py-2.5 bg-[#D98236] hover:bg-[#c2712b] text-[#120B07] font-bold text-xs rounded transition-colors cursor-pointer"
          >
            Ver no Etherscan
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
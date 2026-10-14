import { useState, type FormEvent } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ChevronLeft, MoreVertical, Wallet } from 'lucide-react';
import { api, type QuoteSummary } from '../lib/api';
import { Layout } from '../components/Layout';

const Payment = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [displayName, setDisplayName] = useState('Caio Colecionador');
  const [username, setUsername] = useState('caiokurio');
  const [network, setNetwork] = useState('Ethereum');
  const [profileName, setProfileName] = useState('Kurio Collector');
  const [walletAddress, setWalletAddress] = useState('0x742d35Cc6634C0532925a3b8D4C0532950532950');
  const [secondaryWallet, setSecondaryWallet] = useState('');
  const [walletType, setWalletType] = useState('Hot Wallet');
  const [referralCode, setReferralCode] = useState('KURIO2026');
  const [email, setEmail] = useState('contato@email.com');
  const [ensDomain, setEnsDomain] = useState('.eth');
  const [selectedConnectedWallet, setSelectedConnectedWallet] = useState<'reserva' | 'principal'>('reserva');
  const [selectedProvider, setSelectedProvider] = useState('Coinbase Wallet');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [idempotencyKey] = useState(() => 'idem_' + Date.now());

  const { data: quote } = useQuery<QuoteSummary>({
    queryKey: ['cart'],
    queryFn: async () => (await api.get('/cart')).data,
  });

  const orderMutation = useMutation({
    mutationFn: async () =>
      (
        await api.post(
          '/orders',
          {
            walletProvider: selectedProvider,
            network,
            quoteVersion: quote?.quoteVersion,
          },
          {
            headers: { 'Idempotency-Key': idempotencyKey },
          }
        )
      ).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['latest-order'] });
      navigate({ to: '/confirmation' });
    },
    onError: (err: any) => {
      setErrorMsg(err?.response?.data?.message || 'Falha ao processar pedido.');
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  const handleConfirm = (e: FormEvent) => {
    e.preventDefault();
    if (!displayName || !username || !walletAddress || !email) {
      setErrorMsg('Preencha todos os campos obrigatórios marcados com *.');
      return;
    }
    orderMutation.mutate();
  };

  return (
    <Layout>
      {/* Mobile View fiel a PagamentoMobile.png */}
      <div className="md:hidden px-4 pt-6 pb-10 space-y-6">
        <div className="flex items-center">
          <button
            onClick={() => navigate({ to: '/cart' })}
            aria-label="Voltar"
            className="w-10 h-10 rounded-full bg-[#1C120C] border border-[#2E1F16] flex items-center justify-center text-[#D98236]"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="flex-1 text-center text-lg font-bold text-white pr-10">
            Pagamento com carteira
          </h1>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-950/50 border border-red-600 rounded-xl text-xs text-red-300">
            {errorMsg}
          </div>
        )}

        {/* Carteira conectada */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-white text-sm">Carteira conectada</span>
            <button
              type="button"
              onClick={() => navigate({ to: '/wallets' })}
              className="text-[#D98236] font-bold"
            >
              Trocar carteira
            </button>
          </div>

          <div
            onClick={() => {
              setSelectedConnectedWallet('reserva');
              setNetwork('Polygon');
            }}
            className={`bg-[#1C120C] border rounded-2xl p-4 flex items-center justify-between cursor-pointer ${
              selectedConnectedWallet === 'reserva' ? 'border-[#D98236]' : 'border-[#2E1F16]'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <input
                type="radio"
                checked={selectedConnectedWallet === 'reserva'}
                onChange={() => setSelectedConnectedWallet('reserva')}
                className="accent-[#D98236] w-4 h-4"
              />
              <div className="text-xs space-y-0.5">
                <p className="font-bold text-white text-sm">Reserva</p>
                <p className="text-[#A3968C]">nova.kurio.eth</p>
                <p className="text-[#A3968C]">Rede Polygon</p>
              </div>
            </div>
            <MoreVertical className="w-4 h-4 text-[#A3968C]" />
          </div>

          <div
            onClick={() => {
              setSelectedConnectedWallet('principal');
              setNetwork('Ethereum');
            }}
            className={`bg-[#1C120C] border rounded-2xl p-4 flex items-center justify-between cursor-pointer ${
              selectedConnectedWallet === 'principal' ? 'border-[#D98236]' : 'border-[#2E1F16]'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <input
                type="radio"
                checked={selectedConnectedWallet === 'principal'}
                onChange={() => setSelectedConnectedWallet('principal')}
                className="accent-[#D98236] w-4 h-4"
              />
              <div className="text-xs space-y-0.5">
                <p className="font-bold text-white text-sm">Principal</p>
                <p className="text-[#A3968C]">0xA91F...E82C</p>
                <p className="text-[#A3968C]">Rede principal Ethereum</p>
              </div>
            </div>
            <MoreVertical className="w-4 h-4 text-[#A3968C]" />
          </div>
        </div>

        {/* Carteira e rede */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-white">Carteira e rede</h2>

          {[
            { id: 'WalletConnect', label: 'WalletConnect', icon: 'W' },
            { id: 'MetaMask', label: 'MetaMask', icon: 'M' },
            { id: 'Coinbase Wallet', label: 'Coinbase Wallet', icon: 'C' },
          ].map((provider) => (
            <div
              key={provider.id}
              onClick={() => setSelectedProvider(provider.id)}
              className={`bg-[#1C120C] border rounded-2xl p-3.5 flex items-center justify-between cursor-pointer ${
                selectedProvider === provider.id ? 'border-[#D98236]' : 'border-[#2E1F16]'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-full bg-[#261810] border border-[#3E271B] text-[#D98236] font-bold flex items-center justify-center text-xs">
                  {provider.icon === 'C' ? <Wallet className="w-4 h-4" /> : provider.icon}
                </div>
                <span className="text-xs font-medium text-white">{provider.label}</span>
              </div>
              <input
                type="radio"
                checked={selectedProvider === provider.id}
                onChange={() => setSelectedProvider(provider.id)}
                className="accent-[#D98236] w-4 h-4"
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end items-center gap-4 pt-2">
          <span className="text-sm font-bold text-white">Total:</span>
          <span className="text-lg font-bold text-[#D98236]">{quote?.total || '8.936'} ETH</span>
        </div>

        <button
          onClick={handleConfirm}
          disabled={orderMutation.isPending}
          className="w-full py-4 bg-[#D98236] text-[#120B07] font-bold text-sm rounded-full mt-4"
        >
          {orderMutation.isPending ? 'Confirmando...' : 'Confirmar compra'}
        </button>
      </div>

      {/* Desktop View fiel a Pagamento.png */}
      <div className="hidden md:block max-w-7xl mx-auto px-8 py-6">
        <nav className="text-xs text-[#A3968C] mb-6">
          <button onClick={() => navigate({ to: '/' })} className="text-white font-bold">
            Início
          </button>
          <span className="mx-2">/</span>
          <span>Mercado</span>
          <span className="mx-2">/</span>
          <span className="text-white font-bold">Pagamento</span>
        </nav>

        <form onSubmit={handleConfirm} className="grid grid-cols-12 gap-10">
          <div className="col-span-8 space-y-5">
            <h1 className="text-sm font-bold text-white">Perfil do colecionador</h1>

            {errorMsg && (
              <div className="p-3 bg-red-950/50 border border-red-600 rounded text-xs text-red-300">
                {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-white mb-1.5">
                  Nome de exibição <span className="text-[#D98236]">*</span>
                </label>
                <input
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#120B07] border border-[#2E1F16] rounded text-white"
                />
              </div>

              <div>
                <label className="block text-white mb-1.5">
                  Nome de usuário <span className="text-[#D98236]">*</span>
                </label>
                <input
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 bg-[#120B07] border border-[#2E1F16] rounded text-white"
                />
              </div>

              <div>
                <label className="block text-white mb-1.5">
                  Rede <span className="text-[#D98236]">*</span>
                </label>
                <select
                  value={network}
                  onChange={(e) => setNetwork(e.target.value)}
                  className="w-full px-3 py-2 bg-[#120B07] border border-[#2E1F16] rounded text-[#A3968C]"
                >
                  <option value="Ethereum">Ethereum</option>
                  <option value="Polygon">Polygon</option>
                  <option value="Solana">Solana</option>
                </select>
              </div>

              <div>
                <label className="block text-white mb-1.5">
                  Nome do perfil <span className="text-[#D98236]">*</span>
                </label>
                <input
                  required
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#120B07] border border-[#2E1F16] rounded text-white"
                />
              </div>

              <div>
                <label className="block text-white mb-1.5">
                  Endereço da carteira <span className="text-[#D98236]">*</span>
                </label>
                <input
                  required
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  placeholder="Endereço 0x da carteira"
                  className="w-full px-3 py-2 bg-[#120B07] border border-[#2E1F16] rounded text-white"
                />
              </div>

              <div className="flex items-end">
                <input
                  value={secondaryWallet}
                  onChange={(e) => setSecondaryWallet(e.target.value)}
                  placeholder="ENS ou carteira secundária (opcional)"
                  className="w-full px-3 py-2 bg-[#120B07] border border-[#2E1F16] rounded text-white"
                />
              </div>

              <div>
                <label className="block text-white mb-1.5">
                  Tipo de carteira <span className="text-[#D98236]">*</span>
                </label>
                <select
                  value={walletType}
                  onChange={(e) => setWalletType(e.target.value)}
                  className="w-full px-3 py-2 bg-[#120B07] border border-[#2E1F16] rounded text-[#A3968C]"
                >
                  <option>Hot Wallet</option>
                  <option>Hardware Wallet</option>
                </select>
              </div>

              <div>
                <label className="block text-white mb-1.5">
                  Código de indicação <span className="text-[#D98236]">*</span>
                </label>
                <input
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                  className="w-full px-3 py-2 bg-[#120B07] border border-[#2E1F16] rounded text-white"
                />
              </div>

              <div>
                <label className="block text-white mb-1.5">
                  E-mail <span className="text-[#D98236]">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-[#120B07] border border-[#2E1F16] rounded text-white"
                />
              </div>

              <div>
                <label className="block text-white mb-1.5">
                  Nome ENS <span className="text-[#D98236]">*</span>
                </label>
                <select
                  value={ensDomain}
                  onChange={(e) => setEnsDomain(e.target.value)}
                  className="w-24 px-3 py-2 bg-[#120B07] border border-[#2E1F16] rounded text-white"
                >
                  <option value=".eth">.eth</option>
                  <option value=".sol">.sol</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs text-white mb-2">
                Observação do colecionador (opcional)
              </label>
              <textarea
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full max-w-md px-3 py-2 bg-[#120B07] border border-[#2E1F16] rounded text-xs text-white"
              />
            </div>
          </div>

          <div className="col-span-4 space-y-4">
            <h2 className="text-sm font-bold text-white">Seus NFTs</h2>
            <div className="flex justify-between text-xs font-bold text-white border-b border-[#2E1F16] pb-2">
              <span>NFTs</span>
              <span>Subtotal</span>
            </div>

            <div className="space-y-3">
              {quote?.items?.map((item) => (
                <div
                  key={item.nftId}
                  className="bg-[#1C120C] border border-[#2E1F16] rounded-lg p-2.5 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={item.nft.image}
                      alt={item.nft.name}
                      className="w-12 h-12 rounded object-cover"
                    />
                    <div>
                      <p className="font-bold text-white">{item.nft.name}</p>
                      <p className="text-[10px] text-[#A3968C]">ID do token: {item.nft.tokenId}</p>
                    </div>
                  </div>
                  <span className="text-[#A3968C]">(x {item.quantity})</span>
                  <span className="font-bold text-[#D98236]">
                    {(parseFloat(item.nft.price) * item.quantity).toFixed(2)} ETH
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-xs border-t border-[#2E1F16] pt-3">
              <div className="flex justify-between text-[#A3968C]">
                <span>Subtotal</span>
                <span className="text-white">{quote?.subtotal || '0.00'} ETH</span>
              </div>
              <div className="flex justify-between text-[#A3968C]">
                <span>Desconto do lançamento</span>
                <span className="text-white">(-) {quote?.discount || '00.00'}</span>
              </div>
              <div className="flex justify-between text-[#A3968C]">
                <span>Taxa de rede</span>
                <span className="text-white">{quote?.networkFee || '0.016'} ETH</span>
              </div>
              <div className="flex justify-between text-sm font-bold pt-2 border-t border-[#2E1F16]">
                <span className="text-white">Total</span>
                <span className="text-[#D98236]">{quote?.total || '0.000'} ETH</span>
              </div>
            </div>

            <div className="pt-2 space-y-2.5">
              <h3 className="text-xs font-bold text-white text-center">Carteira e rede</h3>
              {[
                { id: 'WalletConnect', label: 'METAMASK • WALLETCONNECT • COINBASE', badge: true },
                { id: 'MetaMask', label: 'MetaMask' },
                { id: 'Coinbase Wallet', label: 'Coinbase Wallet' },
              ].map((w) => (
                <label
                  key={w.id}
                  onClick={() => setSelectedProvider(w.id)}
                  className={`flex items-center gap-3 p-3 rounded border text-xs cursor-pointer ${
                    selectedProvider === w.id
                      ? 'border-[#D98236] bg-[#1C120C]'
                      : 'border-[#2E1F16] bg-[#120B07]'
                  }`}
                >
                  <input
                    type="radio"
                    name="walletProviderDesktop"
                    checked={selectedProvider === w.id}
                    onChange={() => setSelectedProvider(w.id)}
                    className="accent-[#D98236]"
                  />
                  <span className="text-white">{w.label}</span>
                </label>
              ))}
            </div>

            <button
              type="submit"
              disabled={orderMutation.isPending}
              className="w-full py-3 bg-[#D98236] hover:bg-[#c2712b] text-[#120B07] font-bold text-xs rounded transition-colors cursor-pointer mt-4"
            >
              {orderMutation.isPending ? 'Confirmando na rede...' : 'Confirmar compra'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default Payment;
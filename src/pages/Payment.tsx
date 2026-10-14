import { useState, type FormEvent } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  const [walletType, setWalletType] = useState('Hardware / Browser');
  const [referralCode, setReferralCode] = useState('KURIO2026');
  const [email, setEmail] = useState('contato@email.com');
  const [ensDomain, setEnsDomain] = useState('.eth');
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
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
        <nav className="text-xs text-[#A3968C] mb-6">
          <button onClick={() => navigate({ to: '/' })} className="text-white font-bold">
            Início
          </button>
          <span className="mx-2">/</span>
          <span>Mercado</span>
          <span className="mx-2">/</span>
          <span className="text-white font-bold">Pagamento</span>
        </nav>

        <form onSubmit={handleConfirm} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Collector Profile Form */}
          <div className="lg:col-span-8 space-y-5">
            <h1 className="text-sm font-bold text-white">Perfil do colecionador</h1>

            {errorMsg && (
              <div className="p-3 bg-red-950/50 border border-red-600 rounded text-xs text-red-300">
                {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
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
                  <option>Selecione uma carteira</option>
                  <option>Hot Wallet (MetaMask / Coinbase)</option>
                  <option>Hardware Wallet (Ledger)</option>
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

            <div className="pt-2">
              <label className="inline-flex items-center gap-2 text-xs text-white cursor-pointer">
                <input type="radio" name="otherWallet" className="accent-[#D98236]" />
                Usar outra carteira?
              </label>
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

          {/* Right Order Summary & Wallet Selection */}
          <div className="lg:col-span-4 space-y-4">
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

            <p className="text-[11px] text-[#A3968C] text-right">
              Tem um código promocional?{' '}
              <button
                type="button"
                onClick={() => navigate({ to: '/cart' })}
                className="text-white hover:underline"
              >
                Aplique aqui
              </button>
            </p>

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
              <div className="text-center text-[10px] text-[#D98236]">Taxa estimada</div>
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
                    name="walletProvider"
                    checked={selectedProvider === w.id}
                    onChange={() => setSelectedProvider(w.id)}
                    className="accent-[#D98236]"
                  />
                  {w.badge ? (
                    <span className="bg-[#261810] border border-[#3E271B] rounded px-2 py-0.5 text-[9px] text-[#D98236]">
                      {w.label}
                    </span>
                  ) : (
                    <span className="text-white">{w.label}</span>
                  )}
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
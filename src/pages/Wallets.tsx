import { useState, type FormEvent } from 'react';
import { useNavigate } from '@tanstack/react-router';
import {
  User,
  MapPin,
  ShoppingCart,
  Heart,
  TrendingUp,
  Download,
  AlertTriangle,
  LogOut,
} from 'lucide-react';
import { Layout } from '../components/Layout';
import { api } from '../lib/api';

const Wallets = () => {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState('Caio Colecionador');
  const [walletAlias, setWalletAlias] = useState('MetaMask Principal');
  const [network, setNetwork] = useState('Ethereum');
  const [profileName, setProfileName] = useState('caiokurio');
  const [address, setAddress] = useState('0x742d35Cc6634C0532925a3b8D4C0532950532950');
  const [secondaryAddress, setSecondaryAddress] = useState('');
  const [walletProvider, setWalletProvider] = useState('MetaMask');
  const [referralCode, setReferralCode] = useState('KURIO2026');
  const [email, setEmail] = useState('contato@email.com');
  const [ensDomain, setEnsDomain] = useState('.eth');
  const [ensName, setEnsName] = useState('caio');
  const [savedMsg, setSavedMsg] = useState('');

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    await api.put('/wallets', {
      type: 'primary',
      displayName,
      walletAlias,
      network,
      profileName,
      address,
      secondaryAddress,
      walletProvider,
      referralCode,
      email,
      ensDomain,
      ensName,
    });
    setSavedMsg('Carteira salva com sucesso!');
    setTimeout(() => setSavedMsg(''), 3000);
  };

  return (
    <Layout hideFooter>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 grid grid-cols-1 md:grid-cols-12 gap-10">
        {/* Sidebar */}
        <aside className="md:col-span-3">
          <div className="bg-[#1C120C] border border-[#2E1F16] rounded-xl p-5 space-y-4">
            <h2 className="text-sm font-bold text-white px-2">Meu perfil</h2>
            <nav className="space-y-1 text-xs">
              <button
                onClick={() => navigate({ to: '/profile' })}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-[#A3968C] hover:text-white cursor-pointer"
              >
                <User className="w-4 h-4" /> Dados do perfil
              </button>
              <button
                onClick={() => navigate({ to: '/wallets' })}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-[#D98236] border-l-2 border-[#D98236] bg-[#261810]/50 font-bold cursor-pointer"
              >
                <MapPin className="w-4 h-4" /> Carteiras
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2.5 text-[#A3968C] hover:text-white">
                <ShoppingCart className="w-4 h-4" /> Atividade
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2.5 text-[#A3968C] hover:text-white">
                <Heart className="w-4 h-4" /> Lista de interesse
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2.5 text-[#A3968C] hover:text-white">
                <TrendingUp className="w-4 h-4" /> Ofertas
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2.5 text-[#A3968C] hover:text-white">
                <Download className="w-4 h-4" /> Arquivos baixados
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2.5 text-[#A3968C] hover:text-white">
                <AlertTriangle className="w-4 h-4" /> Suporte
              </button>
              <div className="border-t border-[#2E1F16] pt-2 mt-2">
                <button
                  onClick={() => navigate({ to: '/' })}
                  className="w-full flex items-center gap-3 px-3 py-2 text-[#D98236] font-bold hover:underline cursor-pointer"
                >
                  <LogOut className="w-4 h-4" /> Sair
                </button>
              </div>
            </nav>
          </div>
        </aside>

        {/* Form Carteira Principal e Secundária */}
        <section className="md:col-span-9 space-y-6 max-w-3xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-sm font-bold text-white">Carteira principal</h1>
              <p className="text-xs text-[#A3968C] mt-1">
                Estas carteiras ficam disponíveis no pagamento e para receber NFTs comprados.
              </p>
            </div>
            <button className="text-xs font-bold text-[#D98236] hover:underline">
              Adicionar
            </button>
          </div>

          {savedMsg && (
            <div className="p-3 bg-emerald-950/60 border border-emerald-600 rounded text-xs text-emerald-300">
              {savedMsg}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-5 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white mb-1.5">
                  Nome de exibição <span className="text-[#D98236]">*</span>
                </label>
                <input
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#120B07] border border-[#2E1F16] rounded text-white"
                />
              </div>

              <div>
                <label className="block text-white mb-1.5">
                  Apelido da carteira <span className="text-[#D98236]">*</span>
                </label>
                <input
                  required
                  value={walletAlias}
                  onChange={(e) => setWalletAlias(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#120B07] border border-[#2E1F16] rounded text-white"
                />
              </div>

              <div>
                <label className="block text-white mb-1.5">
                  Rede <span className="text-[#D98236]">*</span>
                </label>
                <select
                  value={network}
                  onChange={(e) => setNetwork(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#120B07] border border-[#2E1F16] rounded text-[#A3968C]"
                >
                  <option value="Ethereum">Selecione uma rede (Ethereum)</option>
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
                  className="w-full px-3 py-2.5 bg-[#120B07] border border-[#2E1F16] rounded text-white"
                />
              </div>

              <div>
                <label className="block text-white mb-1.5">
                  Endereço da carteira <span className="text-[#D98236]">*</span>
                </label>
                <input
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Endereço 0x da carteira"
                  className="w-full px-3 py-2.5 bg-[#120B07] border border-[#2E1F16] rounded text-white"
                />
              </div>

              <div className="flex items-end">
                <input
                  value={secondaryAddress}
                  onChange={(e) => setSecondaryAddress(e.target.value)}
                  placeholder="ENS ou carteira secundária (opcional)"
                  className="w-full px-3 py-2.5 bg-[#120B07] border border-[#2E1F16] rounded text-white"
                />
              </div>

              <div>
                <label className="block text-white mb-1.5">
                  Tipo de carteira <span className="text-[#D98236]">*</span>
                </label>
                <select
                  value={walletProvider}
                  onChange={(e) => setWalletProvider(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#120B07] border border-[#2E1F16] rounded text-[#A3968C]"
                >
                  <option value="MetaMask">Selecione uma carteira (MetaMask)</option>
                  <option value="Coinbase Wallet">Coinbase Wallet</option>
                  <option value="WalletConnect">WalletConnect</option>
                </select>
              </div>

              <div>
                <label className="block text-white mb-1.5">
                  Código de indicação <span className="text-[#D98236]">*</span>
                </label>
                <input
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#120B07] border border-[#2E1F16] rounded text-white"
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
                  className="w-full px-3 py-2.5 bg-[#120B07] border border-[#2E1F16] rounded text-white"
                />
              </div>

              <div>
                <label className="block text-white mb-1.5">
                  Nome ENS <span className="text-[#D98236]">*</span>
                </label>
                <div className="flex gap-2">
                  <select
                    value={ensDomain}
                    onChange={(e) => setEnsDomain(e.target.value)}
                    className="px-3 py-2.5 bg-[#120B07] border border-[#2E1F16] rounded text-white"
                  >
                    <option value=".eth">.eth</option>
                    <option value=".sol">.sol</option>
                  </select>
                  <input
                    value={ensName}
                    onChange={(e) => setEnsName(e.target.value)}
                    className="flex-1 px-3 py-2.5 bg-[#120B07] border border-[#2E1F16] rounded text-white"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-[#D98236] hover:bg-[#c2712b] text-[#120B07] font-bold rounded text-xs cursor-pointer"
            >
              Salvar carteira
            </button>
          </form>

          <div className="pt-6 border-t border-[#2E1F16] flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-bold text-white">Carteira secundária</h2>
              <p className="text-xs text-[#A3968C] mt-1">
                Você ainda não adicionou uma carteira secundária.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <label className="inline-flex items-center gap-2 text-white">
                <input type="radio" className="accent-[#D98236]" />
                Igual à carteira principal
              </label>
              <button className="font-bold text-[#D98236] hover:underline">Adicionar</button>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Wallets;
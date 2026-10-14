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
  Eye,
  Image as ImageIcon,
} from 'lucide-react';
import { Layout } from '../components/Layout';
import { api } from '../lib/api';

const Profile = () => {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState('Caio Colecionador');
  const [username, setUsername] = useState('caiokurio');
  const [email, setEmail] = useState('contato@email.com');
  const [ensDomain, setEnsDomain] = useState('.eth');
  const [ensName, setEnsName] = useState('caio');
  const [walletAlias, setWalletAlias] = useState('MetaMask Principal');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savedMsg, setSavedMsg] = useState('');

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    await api.put('/profile', {
      displayName,
      username,
      email,
      ensDomain,
      ensName,
      walletAlias,
    });
    setSavedMsg('Dados do perfil atualizados com sucesso!');
    setTimeout(() => setSavedMsg(''), 3000);
  };

  return (
    <Layout hideFooter>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 grid grid-cols-1 md:grid-cols-12 gap-10">
        {/* Left Sidebar Meu Perfil */}
        <aside className="md:col-span-3">
          <div className="bg-[#1C120C] border border-[#2E1F16] rounded-xl p-5 space-y-4">
            <h2 className="text-sm font-bold text-white px-2">Meu perfil</h2>
            <nav className="space-y-1 text-xs">
              <button
                onClick={() => navigate({ to: '/profile' })}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-[#D98236] border-l-2 border-[#D98236] bg-[#261810]/50 font-bold cursor-pointer"
              >
                <User className="w-4 h-4" /> Dados do perfil
              </button>
              <button
                onClick={() => navigate({ to: '/wallets' })}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-[#A3968C] hover:text-white cursor-pointer"
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
                  onClick={async () => {
                    await api.post('/logout');
                    navigate({ to: '/' });
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-[#D98236] font-bold hover:underline cursor-pointer"
                >
                  <LogOut className="w-4 h-4" /> Sair
                </button>
              </div>
            </nav>
          </div>
        </aside>

        {/* Right Form */}
        <section className="md:col-span-9">
          <form onSubmit={handleSave} className="space-y-6 max-w-3xl">
            <h1 className="text-sm font-bold text-white">Perfil do colecionador</h1>

            {savedMsg && (
              <div className="p-3 bg-emerald-950/60 border border-emerald-600 rounded text-xs text-emerald-300">
                {savedMsg}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              <div>
                <label className="block text-white mb-2">
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
                <label className="block text-white mb-2">
                  Nome de usuário <span className="text-[#D98236]">*</span>
                </label>
                <input
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#120B07] border border-[#2E1F16] rounded text-white"
                />
              </div>

              <div>
                <label className="block text-white mb-2">
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
                <label className="block text-white mb-2">
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

              <div>
                <label className="block text-white mb-2">
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
                <label className="block text-white mb-2">Avatar</label>
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full bg-[#1C120C] border border-[#2E1F16] flex items-center justify-center text-[#D98236]">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                  <button
                    type="button"
                    className="px-4 py-2 bg-[#D98236] text-[#120B07] font-bold rounded text-xs"
                  >
                    Alterar
                  </button>
                  <button type="button" className="text-xs text-[#A3968C] hover:text-white">
                    Remover
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 max-w-sm text-xs">
              <h2 className="text-sm font-bold text-white">Alterar senha</h2>

              <div>
                <label className="block text-white mb-2">Senha atual</label>
                <div className="relative">
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#120B07] border border-[#2E1F16] rounded text-white"
                  />
                  <Eye className="w-4 h-4 text-[#D98236] absolute right-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-white mb-2">Nova senha</label>
                <div className="relative">
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#120B07] border border-[#2E1F16] rounded text-white"
                  />
                  <Eye className="w-4 h-4 text-[#D98236] absolute right-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-white mb-2">Confirmar nova senha</label>
                <div className="relative">
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#120B07] border border-[#2E1F16] rounded text-white"
                  />
                  <Eye className="w-4 h-4 text-[#D98236] absolute right-3 top-3" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="px-8 py-2.5 bg-[#D98236] hover:bg-[#c2712b] text-[#120B07] font-bold text-xs rounded cursor-pointer"
            >
              Salvar
            </button>
          </form>
        </section>
      </div>
    </Layout>
  );
};

export default Profile;
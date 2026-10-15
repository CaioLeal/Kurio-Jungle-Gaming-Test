import { useState, useEffect, type ReactNode, type FormEvent } from 'react';
import { useNavigate, useLocation } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ShoppingCart,
  Heart,
  Home as HomeIcon,
  User,
  Scan,
  X,
  Eye,
  EyeOff,
} from 'lucide-react';
import { api, type QuoteSummary } from '../lib/api';
import { setupRealtimeSocket } from '../lib/socket';

interface LayoutProps {
  children: ReactNode;
  hideFooter?: boolean;
}

export function Layout({ children, hideFooter = false }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [realtimeNotice, setRealtimeNotice] = useState('');

  // Form states
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('contato@email.com');
  const [password, setPassword] = useState('12345678');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Conecta o Socket.IO em tempo real e libera listeners ao desmontar (Seção 7 do README)
  useEffect(() => {
    const socket = setupRealtimeSocket(queryClient, (msg) => {
      setRealtimeNotice(msg);
      setTimeout(() => setRealtimeNotice(''), 6000);
    });
    return () => {
      socket.disconnect();
    };
  }, [queryClient]);

  const { data: sessionData } = useQuery({
    queryKey: ['session'],
    queryFn: async () => (await api.get('/session')).data,
    staleTime: 0,
  });

  const { data: cartData } = useQuery<QuoteSummary>({
    queryKey: ['cart'],
    queryFn: async () => (await api.get('/cart')).data,
  });

  const totalCartItems =
    cartData?.items?.reduce((acc, item) => acc + item.quantity, 0) ?? 0;

  const loginMutation = useMutation({
    mutationFn: async () => {
      if (authMode === 'login') {
        return (await api.post('/login', { email, password })).data;
      } else {
        if (password !== confirmPassword) {
          throw new Error('As senhas informadas não coincidem.');
        }
        return (await api.post('/register', { username, email, password })).data;
      }
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['session'], data);
      queryClient.invalidateQueries({ queryKey: ['session'] });
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setAuthModalOpen(false);
      setAuthError('');
    },
    onError: (err: any) => {
      setAuthError(
        err?.response?.data?.message || err?.message || 'Erro ao autenticar.'
      );
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => (await api.post('/logout')).data,
    onSuccess: () => {
      // Limpa dados privados em cache ao deslogar ou trocar de usuário (Seção 3 do README)
      queryClient.setQueryData(['session'], { user: null });
      queryClient.setQueryData(['favorites'], { favorites: [] });
      queryClient.invalidateQueries({ queryKey: ['session'] });
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      navigate({ to: '/' });
    },
  });

  const handleAuthSubmit = (e: FormEvent) => {
    e.preventDefault();
    setAuthError('');
    loginMutation.mutate();
  };

  const isMarketActive =
    location.pathname.startsWith('/nft') ||
    location.pathname.startsWith('/cart') ||
    location.pathname.startsWith('/payment');

  const currentUser = sessionData?.user;

  const hideMobileBottomNav =
    location.pathname.startsWith('/nft') ||
    location.pathname.startsWith('/cart') ||
    location.pathname.startsWith('/payment');

  return (
    <div className="min-h-screen bg-[#120B07] text-[#F5EFEA] font-mono flex flex-col pb-20 md:pb-0">
      {/* Alerta Acessível de Tempo Real (Socket.IO) */}
      {realtimeNotice && (
        <div
          role="status"
          aria-live="polite"
          className="bg-[#D98236] text-[#120B07] text-xs font-bold px-4 py-2 text-center"
        >
          ⚡ {realtimeNotice}
        </div>
      )}

      {/* Top Navbar Desktop */}
      <header className="hidden md:flex items-center justify-between max-w-7xl w-full mx-auto px-8 py-6 border-b border-[#261810]">
        <button
          onClick={() => navigate({ to: '/' })}
          className="text-base font-bold tracking-[0.2em] text-white cursor-pointer"
        >
          KURIO
        </button>

        <nav className="flex items-center space-x-8 text-xs">
          <button
            onClick={() => navigate({ to: '/' })}
            className={`pb-2 transition-colors cursor-pointer ${
              location.pathname === '/'
                ? 'text-[#D98236] border-b-2 border-[#D98236] font-bold'
                : 'text-[#A3968C] hover:text-white'
            }`}
          >
            Início
          </button>
          <button
            onClick={() => navigate({ to: '/nft/1' })}
            className={`pb-2 transition-colors cursor-pointer ${
              isMarketActive
                ? 'text-[#D98236] border-b-2 border-[#D98236] font-bold'
                : 'text-[#A3968C] hover:text-white'
            }`}
          >
            Mercado
          </button>
          <button
            onClick={() => navigate({ to: '/profile' })}
            className={`pb-2 transition-colors cursor-pointer ${
              location.pathname === '/profile'
                ? 'text-[#D98236] border-b-2 border-[#D98236] font-bold'
                : 'text-[#A3968C] hover:text-white'
            }`}
          >
            Criadores
          </button>
          <button
            onClick={() => navigate({ to: '/wallets' })}
            className={`pb-2 transition-colors cursor-pointer ${
              location.pathname === '/wallets'
                ? 'text-[#D98236] border-b-2 border-[#D98236] font-bold'
                : 'text-[#A3968C] hover:text-white'
            }`}
          >
            Aprenda
          </button>
        </nav>

        <div className="flex items-center space-x-5">
          <button
            aria-label="Buscar"
            onClick={() => navigate({ to: '/' })}
            className="text-[#F5EFEA] hover:opacity-80 cursor-pointer"
          >
            <img src="/icons/SearchIcon.svg" alt="Buscar" className="w-5 h-5" />
          </button>

          <button
            aria-label="Carrinho"
            onClick={() => navigate({ to: '/cart' })}
            className="relative text-[#F5EFEA] hover:opacity-80 cursor-pointer"
          >
            <img src="/icons/Cart.svg" alt="Carrinho" className="w-5 h-5" />
            <span className="absolute -top-2 -right-2 bg-[#D98236] text-[#120B07] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {totalCartItems}
            </span>
          </button>

          {currentUser ? (
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => navigate({ to: '/profile' })}
                className="flex items-center gap-2 px-3 py-1.5 bg-[#1C120C] border border-[#D98236] text-xs rounded text-white font-bold cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                {currentUser.displayName}
              </button>
              <button
                onClick={() => logoutMutation.mutate()}
                title="Sair da conta"
                className="px-3 py-1.5 bg-[#D98236] hover:bg-[#c2712b] text-[#120B07] font-bold text-xs rounded flex items-center gap-1.5 cursor-pointer"
              >
                <img src="/icons/Logout.svg" alt="" className="w-4 h-4" />
                Sair
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setAuthMode('login');
                setAuthModalOpen(true);
              }}
              className="px-4 py-2 bg-[#D98236] hover:bg-[#c2712b] text-[#120B07] font-bold text-xs rounded flex items-center gap-2 transition-colors cursor-pointer"
            >
              <img src="/icons/Logout.svg" alt="" className="w-4 h-4" />
              Entrar
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1">{children}</div>

      {/* Footer Completo */}
      {!hideFooter && (
        <footer className="max-w-7xl w-full mx-auto px-4 md:px-8 pt-16 pb-10 mt-12">
          <div className="bg-[#1C120C] border border-[#2E1F16] rounded-xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 md:p-8 border-b border-[#2E1F16]">
              <div className="space-y-2 md:border-r md:border-[#2E1F16] md:pr-4">
                <div className="w-10 h-10 rounded-full bg-[#D98236] text-[#120B07] font-bold flex items-center justify-center text-sm mb-3">
                  W
                </div>
                <h4 className="text-xs font-bold text-white">Segurança da carteira</h4>
                <p className="text-[11px] text-[#A3968C] leading-relaxed">
                  Proteja sua carteira e colecione arte digital verificada com confiança.
                </p>
              </div>

              <div className="space-y-2 md:border-r md:border-[#2E1F16] md:pr-4">
                <div className="w-10 h-10 rounded-full bg-[#D98236] text-[#120B07] font-bold flex items-center justify-center text-sm mb-3">
                  C
                </div>
                <h4 className="text-xs font-bold text-white">Criadores em destaque</h4>
                <p className="text-[11px] text-[#A3968C] leading-relaxed">
                  Conheça artistas, estúdios e comunidades que moldam a cultura digital na rede.
                </p>
              </div>

              <div className="space-y-2 md:border-r md:border-[#2E1F16] md:pr-4">
                <div className="w-10 h-10 rounded-full bg-[#D98236] text-[#120B07] font-bold flex items-center justify-center text-sm mb-3">
                  D
                </div>
                <h4 className="text-xs font-bold text-white">Alertas de lançamentos</h4>
                <p className="text-[11px] text-[#A3968C] leading-relaxed">
                  Receba calendários de cunhagem, novidades de listas de acesso e análises do mercado.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-white">
                  Antecipe-se ao próximo lançamento
                </h4>
                <div className="flex">
                  <input
                    type="email"
                    placeholder="digite seu e-mail..."
                    className="bg-[#120B07] border border-[#2E1F16] rounded-l px-3 py-2 text-xs text-white w-full focus:outline-none"
                  />
                  <button className="bg-[#D98236] text-[#120B07] font-bold text-xs px-4 py-2 rounded-r">
                    Enviar
                  </button>
                </div>
                <p className="text-[10px] text-[#A3968C] leading-relaxed">
                  Receba lançamentos selecionados, histórias de criadores e novidades do mercado.
                </p>
              </div>
            </div>

            <div className="bg-[#2B1B10] px-6 md:px-8 py-4 grid grid-cols-1 md:grid-cols-4 gap-4 items-center text-xs border-b border-[#2E1F16]">
              <span className="font-bold tracking-widest text-white">KURIO</span>
              <span className="text-[11px] text-[#A3968C]">
                Feito para colecionadores, criadores e cultura
              </span>
              <span className="text-[11px] text-[#F5EFEA]">contato@email.com</span>
              <span className="text-[11px] text-[#F5EFEA]">+55 11 4002 8922</span>
            </div>

            <div className="p-6 md:p-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-xs">
              <div className="space-y-2">
                <h5 className="font-bold text-white mb-3">Meu perfil</h5>
                <ul className="space-y-1.5 text-[11px] text-[#A3968C]">
                  <li>
                    <button onClick={() => navigate({ to: '/profile' })} className="hover:text-white">
                      Meu perfil
                    </button>
                  </li>
                  <li>
                    <button onClick={() => navigate({ to: '/wallets' })} className="hover:text-white">
                      Minha coleção
                    </button>
                  </li>
                  <li>Atividade</li>
                  <li>Estúdio do criador</li>
                  <li>Lista de interesse</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h5 className="font-bold text-white mb-3">Central de ajuda</h5>
                <ul className="space-y-1.5 text-[11px] text-[#A3968C]">
                  <li>Central de ajuda</li>
                  <li>Como comprar NFTs</li>
                  <li>Carteira e segurança</li>
                  <li>Política do mercado</li>
                  <li>Denunciar item</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h5 className="font-bold text-white mb-3">Coleções</h5>
                <ul className="space-y-1.5 text-[11px] text-[#A3968C]">
                  <li>Arte digital</li>
                  <li>Fotografia</li>
                  <li>Música</li>
                  <li>Arte 3D</li>
                  <li>Utilidade</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h5 className="font-bold text-white">Redes sociais</h5>
                <div className="flex items-center space-x-2">
                  {[
                    { icon: '/icons/Facebook.svg', label: 'Facebook' },
                    { icon: '/icons/Instagram.svg', label: 'Instagram' },
                    { icon: '/icons/TwitterX.svg', label: 'Twitter' },
                    { icon: '/icons/Linkedin.svg', label: 'LinkedIn' },
                  ].map((s) => (
                    <span
                      key={s.label}
                      className="w-7 h-7 border border-[#D98236]/40 rounded flex items-center justify-center hover:border-[#D98236] cursor-pointer"
                    >
                      <img src={s.icon} alt={s.label} className="w-3.5 h-3.5" />
                    </span>
                  ))}
                </div>
                <h5 className="font-bold text-white pt-2">Carteiras compatíveis</h5>
                <div className="inline-block bg-[#261810] border border-[#3E271B] rounded px-2.5 py-1 text-[9px] text-[#D98236] tracking-wider">
                  METAMASK • WALLETCONNECT • COINBASE
                </div>
              </div>
            </div>
          </div>

          <p className="text-center text-[11px] text-[#A3968C] mt-6">
            © 2026 Kurio. Propriedade digital para todos.
          </p>
        </footer>
      )}

      {/* Mobile Bottom Navigation */}
      {!hideMobileBottomNav && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-20 pointer-events-none">
          {/* Fundo SVG com a curva côncava no centro */}
          <svg
            viewBox="0 0 390 80"
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full text-[#1D130D] drop-shadow-[0_-8px_20px_rgba(0,0,0,0.6)]"
          >
            <path
              d="M0,24 Q0,0 28,0 L125,0 C148,0 155,44 195,44 C235,44 242,0 265,0 L362,0 Q390,0 390,24 L390,80 L0,80 Z"
              fill="currentColor"
            />
          </svg>

          {/* Botão Central Flutuante Translúcido */}
          <div className="absolute left-1/2 -translate-x-1/2 -top-6 pointer-events-auto">
            <button
              onClick={() => navigate({ to: '/nft/1' })}
              aria-label="Scanner"
              className="w-15 h-15 rounded-full bg-[#D98943]/80 backdrop-blur-md border border-[#F5EFEA]/20 shadow-[0_6px_20px_rgba(217,130,54,0.45)] flex items-center justify-center text-white"
            >
              <Scan className="w-6 h-6" />
            </button>
          </div>

          {/* Ícones Laterais Sólidos */}
          <div className="relative z-10 h-full px-8 flex items-center justify-between pointer-events-auto">
            <div className="flex items-center gap-11">
              <button
                onClick={() => navigate({ to: '/' })}
                aria-label="Início"
                className="text-[#D98236]"
              >
                <HomeIcon className="w-5 h-5" fill="currentColor" />
              </button>
              <button
                onClick={() => navigate({ to: '/profile' })}
                aria-label="Favoritos"
                className="text-[#C8B29E]"
              >
                <Heart className="w-5 h-5" fill="currentColor" />
              </button>
            </div>

            <div className="flex items-center gap-11">
              <button
                onClick={() => navigate({ to: '/cart' })}
                aria-label="Carrinho"
                className="relative text-[#C8B29E]"
              >
                <ShoppingCart className="w-5 h-5" fill="currentColor" />
                {totalCartItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#D98236] text-[#120B07] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {totalCartItems}
                  </span>
                )}
              </button>
              <button
                onClick={() => navigate({ to: currentUser ? '/profile' : '/login' })}
                aria-label="Perfil"
                className={currentUser ? 'text-[#D98236]' : 'text-[#C8B29E]'}
              >
                <User className="w-5 h-5" fill="currentColor" />
              </button>
            </div>
          </div>
        </nav>
      )}

      {/* Modal de Login / Cadastro */}
      {authModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4"
        >
          <div className="relative w-full max-w-md bg-[#1C120C] border border-[#2E1F16] border-b-4 border-b-[#D98236] rounded-xl p-8 shadow-2xl">
            <button
              onClick={() => setAuthModalOpen(false)}
              aria-label="Fechar modal"
              className="absolute top-4 right-4 text-[#A3968C] hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-3 text-lg font-bold mb-3">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setAuthError('');
                }}
                className={
                  authMode === 'login' ? 'text-[#D98236]' : 'text-white hover:text-[#D98236]'
                }
              >
                Entrar
              </button>
              <span className="text-[#3E271B]">|</span>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('register');
                  setAuthError('');
                }}
                className={
                  authMode === 'register'
                    ? 'text-[#D98236]'
                    : 'text-white hover:text-[#D98236]'
                }
              >
                Criar conta
              </button>
            </div>

            <p className="text-center text-[11px] text-[#A3968C] mb-6 leading-relaxed">
              {authMode === 'login'
                ? 'Entre para gerenciar sua carteira, coleção e perfil de criador.'
                : 'Crie seu perfil de colecionador e conecte uma carteira quando quiser.'}
            </p>

            {authError && (
              <div className="mb-4 p-2.5 bg-red-950/60 border border-red-600/50 rounded text-[11px] text-red-300">
                {authError}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-3">
              {authMode === 'register' && (
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Nome de usuário"
                  className="w-full px-3.5 py-2.5 bg-[#120B07] border border-[#2E1F16] rounded text-xs text-white placeholder-[#A3968C] focus:outline-none focus:border-[#D98236]"
                />
              )}

              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite seu e-mail"
                className="w-full px-3.5 py-2.5 bg-[#120B07] border border-[#2E1F16] rounded text-xs text-white placeholder-[#A3968C] focus:outline-none focus:border-[#D98236]"
              />

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Senha"
                  className="w-full px-3.5 py-2.5 bg-[#120B07] border border-[#2E1F16] rounded text-xs text-white placeholder-[#A3968C] focus:outline-none focus:border-[#D98236]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-[#A3968C]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {authMode === 'register' && (
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirmar senha"
                  className="w-full px-3.5 py-2.5 bg-[#120B07] border border-[#2E1F16] rounded text-xs text-white placeholder-[#A3968C] focus:outline-none focus:border-[#D98236]"
                />
              )}

              {authMode === 'login' && (
                <div className="text-right">
                  <button type="button" className="text-[11px] text-[#D98236] hover:underline">
                    Esqueceu a senha?
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full py-2.5 bg-[#D98236] hover:bg-[#c2712b] text-[#120B07] font-bold text-xs rounded transition-colors mt-2 cursor-pointer"
              >
                {loginMutation.isPending
                  ? 'Processando...'
                  : authMode === 'login'
                  ? 'Entrar'
                  : 'Criar conta'}
              </button>
            </form>

            <div className="relative my-5 text-center">
              <div className="border-t border-[#2E1F16]" />
              <span className="bg-[#1C120C] px-2 text-[10px] text-[#A3968C] -top-2 relative">
                Ou continue com
              </span>
            </div>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => loginMutation.mutate()}
                className="w-full py-2 bg-[#120B07] border border-[#2E1F16] rounded text-xs text-[#F5EFEA] flex items-center justify-center gap-2 hover:border-[#D98236]"
              >
                <span className="font-bold text-blue-400">G</span> Continuar com Google
              </button>
              <button
                type="button"
                onClick={() => loginMutation.mutate()}
                className="w-full py-2 bg-[#120B07] border border-[#2E1F16] rounded text-xs text-[#F5EFEA] flex items-center justify-center gap-2 hover:border-[#D98236]"
              >
                <span className="font-bold text-blue-500">f</span> Continuar com Facebook
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
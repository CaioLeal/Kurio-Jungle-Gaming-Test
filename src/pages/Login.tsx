import { useState, type FormEvent } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Eye, EyeOff } from 'lucide-react';
import { api } from '../lib/api';

const Login = () => {
  const [email, setEmail] = useState('contato@email.com');
  const [password, setPassword] = useState('12345678');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: async () => (await api.post('/login', { email, password })).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session'] });
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      navigate({ to: '/' });
    },
    onError: (err: any) => {
      setError(err?.response?.data?.message || 'Credenciais inválidas.');
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    loginMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-[#120B07] text-[#F5EFEA] font-mono flex flex-col items-center justify-center px-6 py-10">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-6">
          <h1
            onClick={() => navigate({ to: '/' })}
            className="text-3xl font-bold tracking-[0.25em] text-white cursor-pointer"
          >
            KURIO
          </h1>
          <h2 className="text-xl font-bold text-white">Entrar</h2>
        </div>

        {error && (
          <div className="p-3 bg-red-950/60 border border-red-600/50 rounded-xl text-xs text-red-300 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="contato@email.com"
            className="w-full px-4 py-3.5 bg-[#170F0A] border border-[#2E1F16] rounded-xl text-xs text-[#F5EFEA] placeholder-[#A3968C] focus:outline-none focus:border-[#D98236]"
          />

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="************"
              className="w-full px-4 py-3.5 bg-[#170F0A] border border-[#D98236] rounded-xl text-xs text-[#F5EFEA] placeholder-[#A3968C] focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-3.5 text-[#D98236]"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <div className="text-right">
            <button type="button" className="text-xs text-[#D98236] hover:underline">
              Esqueceu a senha?
            </button>
          </div>

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full py-3.5 bg-[#D98236] hover:bg-[#c2712b] text-[#120B07] font-bold text-sm rounded-xl transition-colors cursor-pointer"
          >
            {loginMutation.isPending ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="relative my-6 text-center">
          <div className="border-t border-[#2E1F16]" />
          <span className="bg-[#120B07] px-3 text-xs text-[#F5EFEA] -top-2.5 relative">
            Ou continue com
          </span>
        </div>

        <div className="space-y-3">
          <button
            type="button"
            onClick={() => loginMutation.mutate()}
            className="w-full py-3 bg-[#170F0A] border border-[#2E1F16] rounded-lg text-xs text-[#F5EFEA] flex items-center justify-center gap-3 hover:border-[#D98236]"
          >
            <span className="font-bold text-base text-blue-400">G</span> Continuar com Google
          </button>
          <button
            type="button"
            onClick={() => loginMutation.mutate()}
            className="w-full py-3 bg-[#170F0A] border border-[#2E1F16] rounded-lg text-xs text-[#F5EFEA] flex items-center justify-center gap-3 hover:border-[#D98236]"
          >
            <span className="font-bold text-base text-blue-500">f</span> Continuar com Facebook
          </button>
        </div>

        <p className="text-center text-xs text-[#A3968C] pt-4">
          Novo na Kurio?{' '}
          <button
            onClick={() => navigate({ to: '/register' })}
            className="text-[#F5EFEA] hover:text-[#D98236] underline cursor-pointer"
          >
            Crie uma conta
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
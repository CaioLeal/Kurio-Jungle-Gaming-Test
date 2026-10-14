import { useState, type FormEvent } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Eye, EyeOff } from 'lucide-react';
import { api } from '../lib/api';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const registerMutation = useMutation({
    mutationFn: async () => {
      if (password !== confirmPassword) {
        throw new Error('As senhas não coincidem.');
      }
      return (await api.post('/register', { username, email, password })).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session'] });
      navigate({ to: '/' });
    },
    onError: (err: any) => {
      setError(err?.response?.data?.message || err?.message || 'Erro ao criar conta.');
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    registerMutation.mutate();
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
          <h2 className="text-base font-bold text-white">Criar perfil de colecionador</h2>
        </div>

        {error && (
          <div className="p-3 bg-red-950/60 border border-red-600/50 rounded-xl text-xs text-red-300 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Nome de usuário"
            className="w-full px-4 py-3.5 bg-[#170F0A] border border-[#2E1F16] rounded-xl text-xs text-white placeholder-[#A3968C] text-center focus:outline-none focus:border-[#D98236]"
          />

          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Digite seu e-mail"
            className="w-full px-4 py-3.5 bg-[#170F0A] border border-[#2E1F16] rounded-xl text-xs text-white placeholder-[#A3968C] focus:outline-none focus:border-[#D98236]"
          />

          <div className="relative">
            <input
              type={showPass ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Senha"
              className="w-full px-4 py-3.5 bg-[#170F0A] border border-[#2E1F16] rounded-xl text-xs text-white placeholder-[#A3968C] focus:outline-none focus:border-[#D98236]"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-4 top-3.5 text-[#D98236]"
            >
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <div className="relative">
            <input
              type={showPass ? 'text' : 'password'}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirmar senha"
              className="w-full px-4 py-3.5 bg-[#170F0A] border border-[#2E1F16] rounded-xl text-xs text-white placeholder-[#A3968C] focus:outline-none focus:border-[#D98236]"
            />
            <Eye className="w-4 h-4 text-[#D98236] absolute right-4 top-3.5" />
          </div>

          <button
            type="submit"
            disabled={registerMutation.isPending}
            className="w-full py-3.5 bg-[#D98236] hover:bg-[#c2712b] text-[#120B07] font-bold text-sm rounded-xl transition-colors mt-2 cursor-pointer"
          >
            {registerMutation.isPending ? 'Criando...' : 'Criar perfil'}
          </button>
        </form>

        <div className="relative my-5 text-center">
          <div className="border-t border-[#2E1F16]" />
          <span className="bg-[#120B07] px-3 text-xs text-[#F5EFEA] -top-2.5 relative">
            Ou continue com
          </span>
        </div>

        <div className="space-y-3">
          <button
            type="button"
            className="w-full py-3 bg-[#170F0A] border border-[#2E1F16] rounded-lg text-xs text-[#F5EFEA] flex items-center justify-center gap-3"
          >
            <span className="font-bold text-base text-blue-400">G</span> Continuar com Google
          </button>
          <button
            type="button"
            className="w-full py-3 bg-[#170F0A] border border-[#2E1F16] rounded-lg text-xs text-[#F5EFEA] flex items-center justify-center gap-3"
          >
            <span className="font-bold text-base text-blue-500">f</span> Continuar com Facebook
          </button>
        </div>

        <p className="text-center text-xs text-[#A3968C] pt-4">
          Já tem uma conta?{' '}
          <button
            onClick={() => navigate({ to: '/login' })}
            className="text-[#F5EFEA] hover:text-[#D98236] underline cursor-pointer"
          >
            Entre
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;
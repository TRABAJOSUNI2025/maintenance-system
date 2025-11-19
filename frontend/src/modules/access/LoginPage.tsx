import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import type { UserType } from '@/types/auth';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loading, error: contextError } = useAuth();

  const [email, setEmail] = useState(''); // Pre-filled para testing
  const [password, setPassword] = useState(''); // Pre-filled para testing
  const [userType, setUserType] = useState<UserType>('CLIENTE');
  const [formError, setFormError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!email || !password) {
      setFormError('Por favor completa todos los campos');
      return;
    }

    try {
      await login(email, password, userType);
      navigate('/dashboard');
    } catch (err: any) {
      setFormError(
        err.response?.data?.message || 'Email o contraseña incorrectos'
      );
    }
  };

  return (
    <div className="min-h-screen bg-background-dark flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="text-primary">
              <span className="material-icons text-5xl">
                directions_car
              </span>
            </div>
            <h1 className="text-3xl font-bold text-white">AutoSystem</h1>
          </div>
          <p className="text-gray-400">Iniciar Sesión</p>
        </div>

        {/* Card */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 sm:p-8">
          {/* Error Messages */}
          {(contextError || formError) && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
              {contextError || formError}
            </div>
          )}

          {/* User Type Selector */}
          <div className="flex gap-2 mb-6">
            <button
              type="button"
              onClick={() => setUserType('CLIENTE')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                userType === 'CLIENTE'
                  ? 'bg-primary text-white'
                  : 'bg-white/5 text-gray-400 border border-white/10 hover:border-white/20'
              }`}
            >
              <span className="material-icons inline mr-1">person</span>
              Cliente
            </button>
            <button
              type="button"
              onClick={() => setUserType('TRABAJADOR')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                userType === 'TRABAJADOR'
                  ? 'bg-primary text-white'
                  : 'bg-white/5 text-gray-400 border border-white/10 hover:border-white/20'
              }`}
            >
              <span className="material-icons inline mr-1">engineering</span>
              Trabajador
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Correo Electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  <span className="material-icons text-lg">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 rounded-lg bg-primary text-white font-bold hover:opacity-90 disabled:opacity-50 transition-opacity mt-6"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-background-dark text-gray-400">O</span>
            </div>
          </div>

          {/* Register Link */}
          <p className="text-center text-gray-400">
            ¿No tienes cuenta?{' '}
            <button
              onClick={() => navigate('/register')}
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Registrarse
            </button>
          </p>
        </div>

        {/* Footer Link */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-white transition-colors text-sm"
          >
            ← Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
};


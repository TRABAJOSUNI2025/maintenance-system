import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import type { RegisterClienteDto } from '@/types/auth';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, loading, error: contextError } = useAuth();

  const [formData, setFormData] = useState<RegisterClienteDto>({
    nombre: '',
    apePaterno: '',
    apeMaterno: '',
    correo: '',
    password: '',
    telefono: '',
  });

  const [passwordConfirmacion, setPasswordConfirmacion] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [formError, setFormError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.nombre || !formData.apePaterno || !formData.correo || !formData.password) {
      setFormError('Por favor completa todos los campos requeridos');
      return false;
    }
    if (formData.password !== passwordConfirmacion) {
      setFormError('Las contraseñas no coinciden');
      return false;
    }
    if (formData.password.length < 6) {
      setFormError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.correo)) {
      setFormError('Por favor ingresa un email válido');
      return false;
    }
    return true;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!validateForm()) {
      return;
    }

    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err: any) {
      setFormError(
        err.response?.data?.message || 'Error al crear la cuenta'
      );
    }
  };

  return (
    <div className="min-h-screen bg-background-dark flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="text-primary">
              <span className="material-symbols-outlined text-5xl">
                directions_car
              </span>
            </div>
            <h1 className="text-3xl font-bold text-white">AutoSystem</h1>
          </div>
          <p className="text-gray-400">Crear Cuenta de Cliente</p>
        </div>

        {/* Card */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 sm:p-8">
          {/* Error Messages */}
          {(contextError || formError) && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
              {contextError || formError}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-4">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nombre *
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                placeholder="Juan"
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            {/* Apellido Paterno */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Apellido Paterno *
              </label>
              <input
                type="text"
                name="apePaterno"
                value={formData.apePaterno}
                onChange={handleInputChange}
                placeholder="García"
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            {/* Apellido Materno */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Apellido Materno
              </label>
              <input
                type="text"
                name="apeMaterno"
                value={formData.apeMaterno}
                onChange={handleInputChange}
                placeholder="Martínez"
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            {/* Correo */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Correo Electrónico *
              </label>
              <input
                type="email"
                name="correo"
                value={formData.correo}
                onChange={handleInputChange}
                placeholder="tu@email.com"
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            {/* Teléfono */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Teléfono
              </label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleInputChange}
                placeholder="987654321"
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Contraseña *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Confirmar Contraseña */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Confirmar Contraseña *
              </label>
              <div className="relative">
                <input
                  type={showPasswordConfirm ? 'text' : 'password'}
                  value={passwordConfirmacion}
                  onChange={(e) => setPasswordConfirmacion(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">
                    {showPasswordConfirm ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 rounded-lg bg-primary text-white font-bold hover:opacity-90 disabled:opacity-50 transition-opacity mt-6"
            >
              {loading ? 'Registrando...' : 'Registrarse'}
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

          {/* Login Link */}
          <p className="text-center text-gray-400">
            ¿Ya tienes cuenta?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Iniciar sesión
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

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clientApi } from '../../api/client.api';
import { Navbar } from '../../components/Navbar/Navbar';

export const VehicleRegisterPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState({
    placa: '',
    marca: '',
    modelo: '',
    fechafabricacion: '',
    kilometraje: 0,
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // Validación básica
    if (!formData.placa || !formData.marca || !formData.modelo || !formData.fechafabricacion) {
      setMessage({
        type: 'error',
        text: 'Por favor completa todos los campos requeridos',
      });
      return;
    }

    try {
      setSubmitting(true);
      await clientApi.registerVehicle({
        placa: formData.placa.toUpperCase(),
        marca: formData.marca,
        modelo: formData.modelo,
        fechafabricacion: formData.fechafabricacion,
        kilometraje: formData.kilometraje,
      });

      setMessage({
        type: 'success',
        text: 'Vehículo registrado exitosamente',
      });

      // Resetear formulario
      setFormData({
        placa: '',
        marca: '',
        modelo: '',
        fechafabricacion: '',
        kilometraje: 0,
      });

      // Redirigir después de 2 segundos
      setTimeout(() => {
        navigate('/client/vehicles');
      }, 2000);
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error?.response?.data?.message || 'Error al registrar el vehículo',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background-dark">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Registrar Vehículo</h1>
            <p className="text-gray-400">Ingresa los datos de tu vehículo para registrarlo en el sistema</p>
          </div>

          {/* Form Card */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-8">
            {/* Mensajes de éxito/error */}
            {message && (
              <div
                className={`mb-6 p-4 rounded-lg border flex items-center gap-3 ${
                  message.type === 'success'
                    ? 'bg-green-900/30 border-green-500/50 text-green-400'
                    : 'bg-red-900/30 border-red-500/50 text-red-400'
                }`}
              >
                <span className="material-icons text-lg flex-shrink-0">
                  {message.type === 'success' ? 'check_circle' : 'error'}
                </span>
                <p>{message.text}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Campos del formulario */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {/* Matrícula */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Matrícula <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="ABC-123"
                    value={formData.placa}
                    onChange={(e) => handleInputChange('placa', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-gray-600 focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
                    disabled={isSubmitting}
                    maxLength={6}
                  />
                  <p className="text-xs text-gray-500 mt-1">Máximo 6 caracteres</p>
                </div>

                {/* Marca */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Marca <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Honda, Toyota, Ford"
                    value={formData.marca}
                    onChange={(e) => handleInputChange('marca', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-gray-600 focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
                    disabled={isSubmitting}
                    maxLength={20}
                  />
                </div>

                {/* Modelo */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Modelo <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Civic, Corolla, Focus"
                    value={formData.modelo}
                    onChange={(e) => handleInputChange('modelo', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-gray-600 focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
                    disabled={isSubmitting}
                    maxLength={20}
                  />
                </div>

                {/* Fecha de Fabricación */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Fecha de Fabricación <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.fechafabricacion}
                    onChange={(e) => handleInputChange('fechafabricacion', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
                    disabled={isSubmitting}
                    max={new Date().toISOString().split('T')[0]}
                  />
                </div>

                {/* Kilometraje */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Kilometraje Actual
                  </label>
                  <input
                    type="text"
                    placeholder="0"
                    value={formData.kilometraje}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9.]/g, '');
                      handleInputChange('kilometraje', value ? parseFloat(value) : 0);
                    }}
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-gray-600 focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
                    disabled={isSubmitting}
                  />
                  <p className="text-xs text-gray-500 mt-1">En kilómetros</p>
                </div>
              </div>

              {/* Información adicional */}
              <div className="bg-white/5 border border-white/10 rounded-lg p-4 mt-8">
                <div className="flex items-start gap-3">
                  <span className="material-icons text-blue-400 text-xl flex-shrink-0 mt-1">info</span>
                  <div className="text-sm text-gray-300">
                    <p className="font-medium text-white mb-1">Información importante</p>
                    <p>Los datos registrados serán asociados a tu cuenta. Asegúrate de ingresar correctamente la matrícula (placa) de tu vehículo.</p>
                  </div>
                </div>
              </div>

              {/* Botones */}
              <div className="flex justify-end gap-4 pt-6 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => navigate('/client')}
                  className="px-8 py-3 rounded-lg border border-white/20 text-gray-300 hover:text-white hover:border-white/40 transition-colors font-medium disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-primary hover:opacity-90 text-white font-bold py-3 px-8 rounded-lg transition-opacity disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Registrando...
                    </>
                  ) : (
                    <>
                      <span className="material-icons text-lg">add_circle</span>
                      Registrar Vehículo
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

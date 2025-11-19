import { ProtectedLayout } from '@/components/Layout/ProtectedLayout';

export const DashboardPage = () => {
  return (
    <ProtectedLayout>
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Dashboard</h1>
        <p className="text-gray-400">Página en desarrollo...</p>
      </div>
    </ProtectedLayout>
  );
};

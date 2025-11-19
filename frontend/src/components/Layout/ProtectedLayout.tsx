import type { ReactNode } from 'react';
import { Navbar } from '../Navbar/Navbar';

interface ProtectedLayoutProps {
  children: ReactNode;
}

export const ProtectedLayout: React.FC<ProtectedLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background-dark">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};

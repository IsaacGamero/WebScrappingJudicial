import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import { IdentidadProvider } from '@/context/IdentidadContext';
import MainLayout from '@/components/layout/MainLayout';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LegalTracker - Sistema de Alertas Judiciales',
  description:
    'Plataforma de alertas y monitoreo de expedientes del Poder Judicial del Perú',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AppProvider>
          <IdentidadProvider>
            <MainLayout>{children}</MainLayout>
          </IdentidadProvider>
        </AppProvider>
      </body>
    </html>
  );
}

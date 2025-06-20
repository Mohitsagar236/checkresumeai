import { Outlet } from 'react-router-dom';
import { HeaderWithAuth } from './HeaderWithAuth';
import { Footer } from './Footer';

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <HeaderWithAuth />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

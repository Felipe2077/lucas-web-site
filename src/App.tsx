// src/App.tsx
import { Outlet, Route, Routes } from 'react-router-dom';

// Importe seus componentes de página
import CalendarioPage from './pages/CalendarioPage';
import ContatoPage from './pages/ContatoPage';
import GaleriaAlbumPage from './pages/GaleriaAlbumPage';
import GaleriaPage from './pages/GaleriaPage';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage'; // Para a rota '*'
import NoticiasDetalhePage from './pages/NoticiasDetalhePage';
import NoticiasPage from './pages/NoticiasPage';
import PatrocinadoresPage from './pages/PatrocinadoresPage';
import SobrePage from './pages/SobrePage';

// --- PASSO FUTURO: Importar componentes Header e Footer reais ---
import Footer from './components/layout/Footer';
import Header from './components/layout/Header';

function SiteLayout() {
  return (
    <div className='flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100'>
      <Header />
      <main className='flex-grow '>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path='/' element={<SiteLayout />}>
        <Route index element={<HomePage />} />
        <Route path='noticias' element={<NoticiasPage />} />
        <Route path='noticias/:slug' element={<NoticiasDetalhePage />} />
        <Route path='galeria' element={<GaleriaPage />} />
        <Route path='galeria/:slug' element={<GaleriaAlbumPage />} />
        <Route path='sobre' element={<SobrePage />} />
        <Route path='patrocinadores' element={<PatrocinadoresPage />} />
        <Route path='calendario' element={<CalendarioPage />} />
        <Route path='contato' element={<ContatoPage />} />
        <Route path='*' element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;

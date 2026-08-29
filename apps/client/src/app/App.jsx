import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import ScrollToTop from '../components/common/ScrollToTop';
import AppRoutes from '../routes/AppRoutes';

export default function App() {
  return (
    <div
      className="flex flex-col min-h-screen font-sans transition-colors duration-300"
      style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)' }}
    >
      <Navbar />
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 py-8">
        <AppRoutes />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}


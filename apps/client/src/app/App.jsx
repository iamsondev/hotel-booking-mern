import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import AppRoutes from '../routes/AppRoutes';

export default function App() {
  return (
    <div className="flex flex-col min-h-screen bg-neutral-950 text-neutral-100 font-sans" style={{ background: '#0a0a0a' }}>
      <Navbar />
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 py-8">
        <AppRoutes />
      </main>
      <Footer />
    </div>
  );
}

import { useParams } from 'react-router-dom';

export default function HotelDetails() {
  const { id } = useParams();

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 max-w-2xl mx-auto my-12 shadow-xl">
      <h2 className="text-2xl font-bold text-white mb-2">Hotel Details</h2>
      <p className="text-zinc-550 mb-4" style={{ color: '#888' }}>Viewing credentials for hotel ID: <span className="text-indigo-400 font-mono">{id}</span></p>
      <p className="text-neutral-400 leading-relaxed">
        This is a placeholder page displaying services, layouts, contact info, and available rooms for this hotel.
      </p>
    </div>
  );
}

import { useParams } from 'react-router-dom';

export default function ManageRooms() {
  const { hotelId } = useParams();

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 max-w-2xl mx-auto my-12 shadow-xl">
      <h2 className="text-2xl font-bold text-white mb-2">Manage Rooms</h2>
      <p className="text-neutral-500 mb-4">Editing rooms of hotel ID: <span className="text-indigo-400 font-mono">{hotelId}</span></p>
      <p className="text-neutral-400 leading-relaxed">
        Establish prices, adjust availability, append room variations (Suite, Double, Single), and view room descriptions.
      </p>
    </div>
  );
}

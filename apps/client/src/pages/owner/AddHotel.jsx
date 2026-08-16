import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateHotelMutation } from '../../features/hotels/hotelApiSlice';
import { toast } from 'react-hot-toast';

export default function AddHotel() {
  const navigate = useNavigate();
  const [createHotel, { isLoading }] = useCreateHotelMutation();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [starRating, setStarRating] = useState('3');
  const [imagesString, setImagesString] = useState('');

  // Address subfields
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [zipCode, setZipCode] = useState('');

  // Amenities checklist
  const availableAmenities = ['WiFi', 'Pool', 'Gym', 'Spa', 'Restaurant', 'Parking', 'AC'];
  const [amenities, setAmenities] = useState([]);

  const handleCheckboxChange = (amenity) => {
    if (amenities.includes(amenity)) {
      setAmenities(amenities.filter((item) => item !== amenity));
    } else {
      setAmenities([...amenities, amenity]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !description || !street || !city || !state || !country || !zipCode) {
      toast.error('All fields except images are required');
      return;
    }

    const imageList = imagesString
      .split(',')
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    try {
      await createHotel({
        name,
        description,
        address: {
          line1: street,
          street,
          city,
          state,
          country,
          zipCode,
        },
        amenities,
        starRating: parseInt(starRating) || 3,
        images: imageList,
      }).unwrap();

      toast.success('Hotel listing created! Awaiting admin activation approval.');
      navigate('/owner/hotels');
    } catch (err) {
      toast.error(err?.data?.message || err?.error || 'Failed to submit hotel profile. Please check parameters.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="bg-neutral-900 border border-neutral-805 rounded-3xl p-6 md:p-8 shadow-2xl relative" style={{ borderColor: '#222' }}>
        <h2 className="text-2xl font-bold text-white mb-2">Register New Property</h2>
        <p className="text-neutral-500 text-sm mb-6">Fill in the profile details below. Admin must approve listings before they are displayed publically.</p>

        <form onSubmit={handleSubmit} className="space-y-6 font-sans">
          {/* Basic info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">Hotel Title / Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="StayEase Luxury Hotel"
                className="w-full bg-neutral-950/70 border border-neutral-800 focus:border-indigo-500 rounded-2xl px-4 py-2.5 text-white outline-none focus:ring-1 focus:ring-indigo-550 text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">Star Rating (1-5)</label>
              <select
                value={starRating}
                onChange={(e) => setStarRating(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-indigo-500 rounded-2xl px-4 py-2.5 text-white outline-none focus:ring-1 focus:ring-indigo-555 text-sm capitalize"
                required
              >
                <option value="1">1 Star</option>
                <option value="2">2 Stars</option>
                <option value="3">3 Stars</option>
                <option value="4">4 Stars</option>
                <option value="5">5 Star Luxury</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a detailed description of the services, check-in options, and overview..."
              rows="4"
              className="w-full bg-neutral-950/70 border border-neutral-800 focus:border-indigo-500 rounded-2xl px-4 py-2.5 text-white outline-none focus:ring-1 focus:ring-indigo-550 text-sm resize-none"
              required
            ></textarea>
          </div>

          {/* Address Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-neutral-800 pb-2">Property Address</h3>
            
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">Street Name / Building address</label>
              <input
                type="text"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="123 Ocean View Ave"
                className="w-full bg-neutral-950/70 border border-neutral-800 focus:border-indigo-500 rounded-2xl px-4 py-2.5 text-white outline-none focus:ring-1 focus:ring-indigo-550 text-sm"
                required
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="col-span-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Cox's Bazar"
                  className="w-full bg-neutral-950/70 border border-neutral-800 focus:border-indigo-500 rounded-2xl px-4 py-2.5 text-white outline-none focus:ring-1 focus:ring-indigo-500 text-sm"
                  required
                />
              </div>
              <div className="col-span-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">State / Division</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="Chittagong"
                  className="w-full bg-neutral-950/70 border border-neutral-800 focus:border-indigo-500 rounded-2xl px-4 py-2.5 text-white outline-none focus:ring-1 focus:ring-indigo-500 text-sm"
                  required
                />
              </div>
              <div className="col-span-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">Country</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="Bangladesh"
                  className="w-full bg-neutral-950/70 border border-neutral-800 focus:border-indigo-500 rounded-2xl px-4 py-2.5 text-white outline-none focus:ring-1 focus:ring-indigo-500 text-sm"
                  required
                />
              </div>
              <div className="col-span-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">ZIP Code</label>
                <input
                  type="text"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  placeholder="4700"
                  className="w-full bg-neutral-950/70 border border-neutral-800 focus:border-indigo-500 rounded-2xl px-4 py-2.5 text-white outline-none focus:ring-1 focus:ring-indigo-500 text-sm"
                  required
                />
              </div>
            </div>
          </div>

          {/* Amenities checklist */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-neutral-800 pb-2">Amenities Offerings</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {availableAmenities.map((item) => (
                <label key={item} className="flex items-center space-x-2.5 text-neutral-350 cursor-pointer text-sm">
                  <input
                    type="checkbox"
                    checked={amenities.includes(item)}
                    onChange={() => handleCheckboxChange(item)}
                    className="accent-indigo-500 h-4 w-4 bg-neutral-950 border-neutral-800 rounded focus:ring-0 cursor-pointer"
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Images */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">Picture URLs (comma-separated)</label>
            <input
              type="text"
              value={imagesString}
              onChange={(e) => setImagesString(e.target.value)}
              placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
              className="w-full bg-neutral-950/70 border border-neutral-800 focus:border-indigo-500 rounded-2xl px-4 py-2.5 text-white outline-none focus:ring-1 focus:ring-indigo-500 text-sm"
            />
            <span className="text-xs text-neutral-500 block mt-1.5">Leave blank to default to high quality travel cover photo.</span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-650 hover:bg-indigo-600 bg-indigo-600 text-white font-semibold py-3 rounded-2xl transition duration-300 shadow-lg text-sm cursor-pointer text-center"
          >
            {isLoading ? 'Registering Property Profiles...' : 'Submit Profile for Approval'}
          </button>
        </form>
      </div>
    </div>
  );
}

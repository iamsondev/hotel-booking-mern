import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateHotelMutation } from '../../features/hotels/hotelApiSlice';
import { toast } from 'react-hot-toast';
import CloudinaryImageUpload from '../../components/common/CloudinaryImageUpload';

export default function AddHotel() {
  const navigate = useNavigate();
  const [createHotel, { isLoading }] = useCreateHotelMutation();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [starRating, setStarRating] = useState('3');
  const [images, setImages] = useState([]);

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

    const defaultImages = [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
    ];

    try {
      const response = await createHotel({
        name,
        description,
        address: {
          street,
          city,
          state: state || undefined,
          country,
          zipCode: zipCode || undefined,
        },
        amenities,
        starRating: parseInt(starRating, 10) || 3,
        images: images.length > 0 ? images : defaultImages,
      }).unwrap();

      const hotelId = response?.data?._id || response?._id;

      toast.success("Hotel created! Now add room types to complete your listing.");
      navigate(`/owner/hotels/${hotelId}/rooms`);
    } catch (err) {
      toast.error(err?.data?.message || err?.error || 'Failed to submit hotel profile. Please check parameters.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl p-6 md:p-8 shadow-2xl">
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Register New Property</h2>
        <p className="text-[var(--text-muted)] text-sm mb-6">Fill in the profile details below. Admin must approve listings before they are displayed publically.</p>

        <form onSubmit={handleSubmit} className="space-y-6 font-sans">
          {/* Basic info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-2">Hotel Title / Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="StayEase Luxury Hotel"
                className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] focus:border-[var(--color-primary)] rounded-2xl px-4 py-2.5 text-[var(--text-primary)] outline-none focus:ring-1 focus:ring-[var(--color-primary)]/30 text-sm placeholder:text-[var(--text-muted)] transition"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-2">Star Rating (1-5)</label>
              <select
                value={starRating}
                onChange={(e) => setStarRating(e.target.value)}
                className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] focus:border-[var(--color-primary)] rounded-2xl px-4 py-2.5 text-[var(--text-primary)] outline-none focus:ring-1 focus:ring-[var(--color-primary)]/30 text-sm capitalize transition"
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
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a detailed description of the services, check-in options, and overview..."
              rows="4"
              className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] focus:border-[var(--color-primary)] rounded-2xl px-4 py-2.5 text-[var(--text-primary)] outline-none focus:ring-1 focus:ring-[var(--color-primary)]/30 text-sm resize-none placeholder:text-[var(--text-muted)] transition"
              required
            ></textarea>
          </div>

          {/* Address Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider border-b border-[var(--border-color)] pb-2">Property Address</h3>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-2">Street Name / Building address</label>
              <input
                type="text"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="123 Ocean View Ave"
                className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] focus:border-[var(--color-primary)] rounded-2xl px-4 py-2.5 text-[var(--text-primary)] outline-none focus:ring-1 focus:ring-[var(--color-primary)]/30 text-sm placeholder:text-[var(--text-muted)] transition"
                required
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'City', value: city, setter: setCity, placeholder: "Cox's Bazar" },
                { label: 'State / Division', value: state, setter: setState, placeholder: 'Chittagong' },
                { label: 'Country', value: country, setter: setCountry, placeholder: 'Bangladesh' },
                { label: 'ZIP Code', value: zipCode, setter: setZipCode, placeholder: '4700' },
              ].map(({ label, value, setter, placeholder }) => (
                <div key={label} className="col-span-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-2">{label}</label>
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                    placeholder={placeholder}
                    className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] focus:border-[var(--color-primary)] rounded-2xl px-4 py-2.5 text-[var(--text-primary)] outline-none focus:ring-1 focus:ring-[var(--color-primary)]/30 text-sm placeholder:text-[var(--text-muted)] transition"
                    required
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Amenities checklist */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider border-b border-[var(--border-color)] pb-2">Amenities Offerings</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {availableAmenities.map((item) => (
                <label key={item} className="flex items-center space-x-2.5 text-[var(--text-secondary)] cursor-pointer text-sm">
                  <input
                    type="checkbox"
                    checked={amenities.includes(item)}
                    onChange={() => handleCheckboxChange(item)}
                    className="h-4 w-4 rounded cursor-pointer accent-[var(--color-primary)]"
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Images Upload Section */}
          <CloudinaryImageUpload
            images={images}
            onChange={setImages}
            label="Hotel Gallery Photos"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full text-white font-bold py-3 rounded-2xl transition-all duration-300 shadow-lg text-sm cursor-pointer text-center disabled:opacity-50"
            style={{ background: 'var(--color-primary)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--color-primary-hover)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--color-primary)'}
          >
            {isLoading ? 'Registering Property Profile...' : 'Submit Profile for Approval'}
          </button>
        </form>
      </div>
    </div>
  );
}

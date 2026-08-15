// Mongoose schema and model definition for Room entities associated with hotels
import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema(
  {
    hotel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
    roomNumber: { type: String, required: true },
    type: { type: String, required: true }, // e.g. Single, Double, Deluxe, Suite
    pricePerNight: { type: Number, required: true },
    capacity: { type: Number, required: true },
    isAvailable: { type: Boolean, default: true },
    images: [{ type: String }],
  },
  { timestamps: true }
);

const Room = mongoose.model('Room', roomSchema);
export default Room;

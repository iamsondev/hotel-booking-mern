// Mongoose schema and model definition for Room entities associated with hotels
import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema(
  {
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hotel',
      required: true,
      index: true, // Index for fast room query by hotel
    },
    roomType: {
      type: String,
      enum: ['single', 'double', 'suite', 'deluxe', 'family'],
      required: [true, 'Room type is required'],
    },
    pricePerNight: {
      type: Number,
      required: [true, 'Price per night is required'],
      min: [0, 'Price per night cannot be negative'],
    },
    capacity: {
      adults: {
        type: Number,
        required: [true, 'Adult capacity is required'],
        min: 1,
      },
      children: {
        type: Number,
        default: 0,
      },
    },
    totalRooms: {
      type: Number,
      required: [true, 'Total rooms count is required'],
      min: [1, 'Total rooms must be at least 1'],
    },
    amenities: [{ type: String }],
    images: [{ type: String }],
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Room = mongoose.model('Room', roomSchema);
export default Room;

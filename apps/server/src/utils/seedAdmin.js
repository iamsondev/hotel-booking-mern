import mongoose from 'mongoose';
import { env } from '../config/env.js';
import User from '../modules/user/user.model.js';

const seedAdminAndDemo = async () => {
  try {
    await mongoose.connect(env.MONGO_URI);
    console.log('🌱 Connected to MongoDB for seeding...');

    // Admin account
    const adminEmail = 'admin@stayease.com';
    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      admin = await User.create({
        name: 'System Admin',
        email: adminEmail,
        password: 'adminpassword123',
        role: 'admin',
        isApproved: true,
      });
      console.log('✅ Admin account created: admin@stayease.com / adminpassword123');
    } else {
      admin.role = 'admin';
      admin.password = 'adminpassword123';
      await admin.save();
      console.log('✅ Admin account updated: admin@stayease.com / adminpassword123');
    }

    // Hotel Owner account
    const ownerEmail = 'owner@gmail.com';
    let owner = await User.findOne({ email: ownerEmail });
    if (!owner) {
      owner = await User.create({
        name: 'Demo Hotel Owner',
        email: ownerEmail,
        password: 'password123',
        role: 'hotelOwner',
        isApproved: true,
      });
      console.log('✅ Owner account created: owner@gmail.com / password123');
    } else {
      owner.password = 'password123';
      owner.role = 'hotelOwner';
      await owner.save();
      console.log('✅ Owner account updated: owner@gmail.com / password123');
    }

    // Customer account
    const userEmail = 'user@gmail.com';
    let user = await User.findOne({ email: userEmail });
    if (!user) {
      user = await User.create({
        name: 'Demo Customer',
        email: userEmail,
        password: 'password123',
        role: 'user',
        isApproved: true,
      });
      console.log('✅ User account created: user@gmail.com / password123');
    } else {
      user.password = 'password123';
      user.role = 'user';
      await user.save();
      console.log('✅ User account updated: user@gmail.com / password123');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedAdminAndDemo();

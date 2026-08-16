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
    const ownerEmail = 'owner@stayease.com';
    let owner = await User.findOne({ email: ownerEmail });
    if (!owner) {
      owner = await User.create({
        name: 'Demo Hotel Owner',
        email: ownerEmail,
        password: 'ownerpassword123',
        role: 'hotelOwner',
        isApproved: true,
      });
      console.log('✅ Owner account created: owner@stayease.com / ownerpassword123');
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

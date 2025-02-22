
import mongoose from "mongoose";
import configKeys from './configKeys.js';

const mongoDBConnect = async () => {
    try {
        await mongoose.connect(configKeys.MONGO_URI, {
            readPreference: "secondaryPreferred",
            retryWrites: true,
            w: "majority"
        });

        console.log('✅ Database Connected Successfully to Replica Set');

        const admin = mongoose.connection.db.admin();

        const replicaStatus = await admin.replSetGetStatus();

        // console.log('Replica Set Status:', replicaStatus);

        mongoose.connection.on('connected', () => {
            console.log('🟢 MongoDB connected');
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('⚠️ MongoDB disconnected');
        });

        mongoose.connection.on('error', (error) => {
            console.error('❌ MongoDB connection error:', error);
        });

        mongoose.connection.on('reconnected', () => {
            console.log('🔄 MongoDB reconnected');
        });

    } catch (error) {
        console.error('❌ Failed to connect to MongoDB:', error.message);
        process.exit(1); 
    }
};

export default mongoDBConnect;
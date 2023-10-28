import mongoose from 'mongoose';

let isConnected = false;
const url = 'mongodb+srv://neyoo2078:neyoo2078@cluster0.h9qdnel.mongodb.net/';

export const connectionDb = async () => {
  mongoose.set('strictQuery', true);

  if (isConnected) {
    console.log('data base connection successful');
    return;
  }
  if (!isConnected) {
    try {
      await mongoose.connect(url, {
        dbName: process.env.MONGODB_NAME,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('data base connection successful');
      isConnected = true;
    } catch (error) {
      console.log(error);
    }
  }
};

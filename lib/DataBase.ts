import mongoose from 'mongoose';

let isConnected = false;

const url: any = process.env.MONGODB_URL;
export const connectionDb = async () => {
  mongoose.set('strictQuery', true);

  type connectionOptions = {
    dbName: any;
    useNewUrlParser: Boolean;
    useUnifiedTopology: Boolean;
  };

  const options: connectionOptions = {
    dbName: process.env.MONGODB_NAME,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  if (isConnected) {
    console.log('data base connection successful');
    return;
  }
  if (!isConnected) {
    try {
      await mongoose.connect(url, options);
      console.log('data base connection successful');
      isConnected = true;
    } catch (error) {
      console.log(error);
    }
  }
};

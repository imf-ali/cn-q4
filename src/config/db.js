import mongoose from "mongoose";

const connectToDb = async () => {
  try {
    await mongoose.connect('mongodb://rootuser:rootpass@localhost:27017/');
    console.log('Connected to database');
  } catch (err) {
    console.log('error connecting to database: ' + err.message);
  }
}

export default connectToDb;
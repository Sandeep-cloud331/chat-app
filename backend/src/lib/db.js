import mongoose from "mongoose";

export const ConnectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URL);
    console.log(conn.connection.host);

  }
  catch (error) {
    console.log("mongoDB connection Error:", error);
  }
};
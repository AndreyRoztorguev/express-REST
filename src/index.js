import mongoose from "mongoose";
import { app } from "./server.js";

const port = +process.env.SERVER_PORT || 3001;

try {
  await mongoose.connect(process.env.MONGO_DB_URI);
  console.log("Connected to MongoDB");

  app.listen(port, () => {
    console.log(`Running in ${process.env.LOCALHOST_URL}`);
  });
} catch (error) {
  console.error(error);
}

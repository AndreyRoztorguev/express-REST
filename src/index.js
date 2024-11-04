import mongoose from "mongoose";
import { app } from "./server.js";

const port = +process.env.SERVER_PORT || 3001;

try {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB");

  app.listen(port, () => {
    console.log(`Running in http://localhost:${port}`);
  });
} catch (error) {
  console.error(error);
}

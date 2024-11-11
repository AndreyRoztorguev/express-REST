import mongoose from "mongoose";
import { app } from "./server.js";
import { globalConfig } from "./config/config.js";
import { getKeyValue } from "./utils.js";

const {
  mongodb: { MONGO_URI },
  server: { SERVER_PORT },
} = globalConfig;

getKeyValue(globalConfig);

try {
  await mongoose.connect(MONGO_URI);
  console.log("\x1b[32mConnected to MongoDB uri:\x1b[0m", `\x1b[34m${MONGO_URI}\x1b[0m`);

  app.listen(SERVER_PORT, () => {
    console.log(`\x1b[32mRunning on port \x1b[34m${SERVER_PORT}\x1b[0m`);
  });
} catch (error) {
  console.error(error);
  process.exit(1);
}

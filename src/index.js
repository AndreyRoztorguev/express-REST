import { app } from "./server.js";
import path from "node:path";

const port = 3000;

app.listen(port, () => {
  console.log(path.join(process.cwd(), "db.json"));
  console.log(`Running in http://localhost:${port}`);
});

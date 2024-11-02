import { writeFileSync } from "node:fs";
import { join } from "node:path";

const dbPath = join(process.cwd(), "db.json");

const restoreDb = () => writeFileSync(dbPath, JSON.stringify([]));

const populateDb = (data) => {
  try {
    console.log("data", data);

    writeFileSync(dbPath, JSON.stringify(data));
  } catch (error) {
    console.error("Error writing to database:", error);
  }
};

export { restoreDb, populateDb };

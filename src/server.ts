import "dotenv/config";

import cors from "cors";
import express from "express";

const PORT = process.env.PORT ?? 8080;

const app = express();

app.use(cors());

app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

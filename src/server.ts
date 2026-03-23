import "dotenv/config";

import cors from "cors";
import express from "express";

import router from "@/routers/index.js";

const PORT = process.env.PORT ?? 8080;

const app = express();

app.use(cors());

app.use(express.json());

app.use(router);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

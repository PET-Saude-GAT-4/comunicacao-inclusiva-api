import "dotenv/config";

import cors from "cors";
import express from "express";

import routes from "./routers/index.js"

const PORT = process.env.PORT ?? 8080;

const app = express();

app.use(cors());

app.use(express.json());

app.use("/", routes)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

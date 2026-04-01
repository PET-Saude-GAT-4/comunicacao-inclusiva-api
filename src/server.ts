import "dotenv/config";

import cors from "cors";
import express from "express";

import router from "@/routers/index.js";

import ErrorHandlerMiddleware from "./middlewares/ErrorHandlerMiddleware.js";
import RouterNotFoundMiddleware from "./middlewares/RouterNotFoundMiddleware.js";

const PORT = process.env.PORT ?? 8080;

const app = express();

const errorHandler = new ErrorHandlerMiddleware();
const routerNotFound = new RouterNotFoundMiddleware();

app.use(cors());

app.use(express.json());

app.use(router);

app.use(routerNotFound.handle);

app.use(errorHandler.handle);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

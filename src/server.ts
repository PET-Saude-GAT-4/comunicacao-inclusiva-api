import cors from "cors";
import express from "express";

import { env } from "@/config/env.js";
import router from "@/routers/index.js";

import ErrorHandlerMiddleware from "./middlewares/ErrorHandlerMiddleware.js";
import RouterNotFoundMiddleware from "./middlewares/RouterNotFoundMiddleware.js";

const app = express();

const errorHandler = new ErrorHandlerMiddleware();
const routerNotFound = new RouterNotFoundMiddleware();

app.use(cors());

app.use(express.json());

// express.json() leaves req.body undefined when the request carries no body,
// which breaks every controller that destructures it.
app.use((req, _res, next) => {
  req.body ??= {};
  next();
});

app.use(router);

app.use(routerNotFound.handle);

app.use(errorHandler.handle);

app.listen(env.port, () => {
  console.log(`Server running on port ${env.port}`);
});

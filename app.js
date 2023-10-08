import express from "express";
import "dotenv/config";
import router from "./routes/index.js";
import {
  errorHandler,
  notFound,
  prismaErrorHandler,
} from "./middlewares/index.js";

const app = express();
app.use(express.json());
const { PORT } = process.env;

app.use("/api/v1", router);
app.use(prismaErrorHandler);
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

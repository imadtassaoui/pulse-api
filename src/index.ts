import express from "express";
import http from "http";
import fs from "fs";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config";
import router from "./routes/index";
import helmet from "helmet";

const app = express();

app.use(helmet());
app.use(
  cors({
    credentials: true,
  })
);
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(
  // {
  //   cert: fs.readFileSync("cert.pem"),
  //   key: fs.readFileSync("key.pem"),
  // },
  app
);

server.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}/`);
});

const MONGO_URL = `mongodb+srv://imad:${process.env.MONGO_PASSWORD}@pulse.osqfshq.mongodb.net/?retryWrites=true&w=majority`;
mongoose.Promise = Promise;
mongoose.connect(MONGO_URL);
mongoose.connection.once("open", () => {
  console.log("MongoDB Ready");
});
mongoose.connection.on("error", (err: Error) => {
  console.error(err);
});

app.use("/", router());

export default app;

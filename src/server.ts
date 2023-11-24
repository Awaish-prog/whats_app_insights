import express, { Express } from "express";
import { config } from "dotenv";
import route from "./Routes/router";
const app: Express = express();

app.use(express.json());
app.use(route);

export default app;
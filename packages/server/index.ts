import { WebSocketServer } from "ws";
import express from "express";
import cors from "cors";
require("dotenv").config();

/* CONFIGURE HTTP SERVER */

const httpPort = process.env.PORT ?? 4000;

const app = express();

app.use(cors());
app.use(express.json());

app.listen(httpPort, () => {
  console.log(`HTTP server started on port ${httpPort}`);
});

app.get("/", (req, res) => {
  res.send("Hello world!");
});

/* CONFIGURE WEBSOCKET SERVER */

const wsPort = parseInt(process.env.PORT ?? "5000");

const wss = new WebSocketServer({ port: wsPort });

wss.on("listening", () => {
  console.log(`Websocket server started on port ${wsPort}`);
});

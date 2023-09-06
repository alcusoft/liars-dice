import { WebSocketServer } from "ws";

const port = parseInt(process.env.WS_PORT ?? "5000");

const wss = new WebSocketServer({ port });

wss.on("listening", () => {
  console.log(`Websocket server started on port ${port}`);
});

export default wss;

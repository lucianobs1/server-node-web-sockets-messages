import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";

const app = express();
const server = createServer(app);
const io = new Server(server);

app.get("/", (request, response) => {
  return response.json({
    app: {
      name: "Chat with socket.io",
      tech: "WebSocket with socket.io",
    },
  });
});

app.use(express.static(path.join(__dirname, "..", "public")));

io.on("connection", (socket) => {
  console.log("socket", socket.id);
});

server.listen(3000, () => console.log("server is running"));

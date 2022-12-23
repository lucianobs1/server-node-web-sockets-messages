import "reflect-metadata";

import express from "express";
import { createServer } from "http";
import path from "path";
import { Server } from "socket.io";
import mongoose from "mongoose";

const app = express();
const server = createServer(app);

mongoose.connect("mongodb://127.0.0.1:27017/rocketsocket");

mongoose.set({
  strictQuery: true,
});

const io = new Server(server);

app.use(express.static(path.join(__dirname, "..", "public")));

io.on("connection", (socket) => {
  console.log("socket", socket.connected);
});

export { server, io };

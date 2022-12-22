import { io } from "../http";

// io envio global de informações
// socket controla o envio para alguns ou algum cliente

io.on("connect", (socket) => {
  socket.emit("chat__iniciado", {
    message: "Seu chat foi iniciado",
  });
});

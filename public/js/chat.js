const socket = io("http://localhost:3000");

socket.on("chat__iniciado", (data) => {
  console.log(data);
});

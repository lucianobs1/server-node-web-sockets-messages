const socket = io("http://localhost:3000");

function onLoad() {
  const urlParams = new URLSearchParams(window.location.search),
    name = urlParams.get("name"),
    avatar = urlParams.get("avatar"),
    email = urlParams.get("email");

  console.log(name, email, avatar);

  socket.emit("start", {
    name,
    email,
    avatar,
  });
}

onLoad();

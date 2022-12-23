const socket = io("http://localhost:3000");

function onLoad() {
  const urlParams = new URLSearchParams(window.location.search),
    name = urlParams.get("name"),
    avatar = urlParams.get("avatar"),
    email = urlParams.get("email");

  document.querySelector(".user_logged").innerHTML += `
   <img
    class="avatar_user_logged"
    src=${avatar}
    />
    <strong id="user_logged">${name}</strong> 
  `;

  socket.emit("start", {
    name,
    email,
    avatar,
  });

  socket.on("new_users", (user) => {
    const existInDiv = document.getElementById(`user_${data._id}`);

    if (!existInDiv) {
      addUser(data);
    }
  });

  socket.emit("get_users", (users) => {
    console.log("getUsers", users);

    users.map((user) => {
      if (user.email !== email) {
        addUser(user);
      }
    });
  });
}

const addUser = (user) => {
  const usersList = document.getElementById("users_list");
  usersList.innerHTML += `
  <li
    class="user_name_list"
    id="user_${user._id}"
    idUser="${user._id}"
  >
    <img
      class="nav_avatar"
      src=${user.avatar}
    />
    ${user.name}
  </li> 
  `;
};

onLoad();

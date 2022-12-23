const socket = io("http://localhost:3000");
let idChatRoom = "";

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
    const existInDiv = document.getElementById(`user_${user._id}`);

    if (!existInDiv) {
      addUser(user);
    }
  });

  socket.emit("get_users", (users) => {
    // console.log("getUsers", users);

    users.map((user) => {
      if (user.email !== email) {
        addUser(user);
      }
    });
  });

  socket.on("message", (data) => {
    console.log("message", data);

    if (data.message.roomId === idChatRoom) {
      addMessage(data);
    }
  });

  socket.on("notification", (data) => {
    if (data.roomId !== idChatRoom) {
      const user = document.getElementById(`user_${data.from._id}`);

      user.insertAdjacentHTML(
        "afterbegin",
        `
        <div class="notification"> </div>
      `
      );
    }
  });
}

const addMessage = (data) => {
  const divMessageUser = document.getElementById("message_user");

  divMessageUser.innerHTML += `
 <span class="user_name user_name_date">

    <img
      class="img_user"
      src=${data.user.avatar}
    />

    <strong>${data.user.name}</strong>
    
    <span>${dayjs(data.message.created_at).format(
      "DD/MM/YYYY HH:mm"
    )}</span></span>

    <div class="messages">
      <span class="chat_message">${data.message.text}</span>
    </div> 
  `;
};

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

document.getElementById("users_list").addEventListener("click", (e) => {
  document.getElementById("message_user").innerHTML = "";

  if (e.target && e.target.matches("li.user_name_list")) {
    const idUser = e.target.getAttribute("idUser");
    // console.log("idUser", idUser);

    const notification = document.querySelector(
      `#user_${idUser} .notification`
    );

    if (notification) {
      notification.remove();
    }

    socket.emit("start_chat", { idUser }, (response) => {
      // console.log(response.room.idChatRoom);
      idChatRoom = response.room.idChatRoom;

      response.messages.forEach((message) => {
        const data = {
          message,
          user: message.to,
        };

        addMessage(data);
      });
    });
  }
});

document.getElementById("user_message").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const message = e.target.value;
    // console.log("Message", message);

    e.target.value = "";

    const data = {
      message,
      idChatRoom,
    };

    socket.emit("message", data);
  }
});

onLoad();

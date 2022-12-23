import { io } from "../http";
import { container } from "tsyringe";
import { CreateChatRoomService } from "../services/CreateChatRoomService";
import { CreateUserService } from "../services/CreateUserService";
import { GetAllUsersService } from "../services/GetAllUsersService";
import { GetUserBySocketIDService } from "../services/GetUserBySocketIDService";
import { GetChatRoomByUsersService } from "../services/GetChatRoomByUsersService";

// io envio global de informações
// socket controla o envio para alguns ou algum cliente

io.on("connect", (socket) => {
  socket.on("start", async (data) => {
    const { name, email, avatar } = data;
    const createUserService = container.resolve(CreateUserService);

    const user = await createUserService.execute({
      name,
      email,
      avatar,
      socket_id: socket.id,
    });

    // Envia mensagem ou informação para todos os usuarios exceto a si mesmo
    socket.broadcast.emit("new_users", user);
  });

  socket.on("get_users", async (callback) => {
    const getAllUsersServices = container.resolve(GetAllUsersService);
    const users = await getAllUsersServices.execute();

    callback(users);
  });

  socket.on("start_chat", async (data, callback) => {
    const getChatRoomByUsersService = container.resolve(
      GetChatRoomByUsersService
    );
    const createChatRoomService = container.resolve(CreateChatRoomService);
    const getUserBySocketIdService = container.resolve(
      GetUserBySocketIDService
    );

    const userLogged = await getUserBySocketIdService.execute(socket.id);

    let room = await getChatRoomByUsersService.execute([
      data.idUser,
      userLogged._id,
    ]);

    if (!room) {
      room = await createChatRoomService.execute([data.idUser, userLogged._id]);
    }

    console.log(room);

    callback({ room });
  });
});

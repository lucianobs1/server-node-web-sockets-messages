import { io } from "../http";
import { container } from "tsyringe";
import { CreateChatRoomService } from "../services/CreateChatRoomService";
import { CreateUserService } from "../services/CreateUserService";
import { GetAllUsersService } from "../services/GetAllUsersService";
import { GetUserBySocketIDService } from "../services/GetUserBySocketIDService";
import { GetChatRoomByUsersService } from "../services/GetChatRoomByUsersService";
import { CreateMessageService } from "../services/CreateMessageService";
import { GetMessagesByChatRoomService } from "../services/GetMessagesByChatRoomService";
import { GetChatRoomByIDService } from "../services/GetChatRoomByIDService";

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

    const getMessagesByChatRoomService = container.resolve(
      GetMessagesByChatRoomService
    );

    const userLogged = await getUserBySocketIdService.execute(socket.id);

    let room = await getChatRoomByUsersService.execute([
      data.idUser,
      userLogged._id,
    ]);

    if (!room) {
      room = await createChatRoomService.execute([data.idUser, userLogged._id]);
    }

    socket.join(room.idChatRoom);

    // getMessagesOfRoom
    const messages = await getMessagesByChatRoomService.execute(
      room.idChatRoom
    );

    callback({ room, messages });
  });

  socket.on("message", async (data) => {
    const createMessageService = container.resolve(CreateMessageService);
    const getChatRoomByIDService = container.resolve(GetChatRoomByIDService);
    const getUserBySocketIdService = container.resolve(
      GetUserBySocketIDService
    );

    const user = await getUserBySocketIdService.execute(socket.id);

    const message = await createMessageService.execute({
      to: user._id,
      text: data.message,
      roomId: data.idChatRoom,
    });

    // Enviar notificação para outros usúarios
    io.to(data.idChatRoom).emit("message", {
      message,
      user,
    });

    // Enviar notificação para o usuário correto

    const room = await getChatRoomByIDService.execute(data.idChatRoom);
    const userFrom = room.idUsers.find(
      (response) => String(response._id) != String(user._id)
    );

    io.to(userFrom.socket_id).emit("notification", {
      newMessage: true,
      roomId: data.idChatRoom,
      from: user,
    });
  });
});

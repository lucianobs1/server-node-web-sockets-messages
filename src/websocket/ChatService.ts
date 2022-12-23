import { container } from "tsyringe";
import { io } from "../http";
import { CreateUserService } from "../services/CreateUserService";
import { GetAllUsersService } from "../services/GetAllUsersService";

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
});

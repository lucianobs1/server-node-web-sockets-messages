import { container } from "tsyringe";
import { io } from "../http";
import { CreateUserService } from "../services/CreateUserService";

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

    console.log(user);
  });
});

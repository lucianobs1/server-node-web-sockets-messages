import { injectable } from "tsyringe";
import { User } from "../schemas/User";

interface CreateUserDTO {
  name: string;
  email: string;
  avatar: string;
  socket_id: string;
}

@injectable()
class CreateUserService {
  async execute({ name, email, avatar, socket_id }: CreateUserDTO) {
    const userAlreadyExists = await User.findOne({
      email,
    }).exec();

    if (userAlreadyExists) {
      const user = await User.findOneAndUpdate(
        {
          _id: userAlreadyExists._id,
        },
        {
          $set: { socket_id, avatar, name },
        }
      );

      return user;
    } else {
      const user = await User.create({
        name,
        email,
        avatar,
        socket_id,
      });

      return user;
    }
  }
}

export { CreateUserService };

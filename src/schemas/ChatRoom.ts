import { randomUUID as uuid } from "crypto";
import mongoose, { Document, Schema } from "mongoose";
import { User } from "./User";

type ChatRoom = Document & {
  idUsers: User[];
  idChatRoom: string;
};

const ChatRoomSchema = new Schema({
  idUsers: [
    {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
  ],
  idChatRoom: {
    type: String,
    default: uuid,
  },
});

const ChatRoom = mongoose.model<ChatRoom>("ChatRoom", ChatRoomSchema);

export { ChatRoom };

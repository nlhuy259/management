import { Server, Socket } from "socket.io";
import { createMessage } from "../services/message.service";

type JoinPayload = { userId: string };
type SendPayload = { senderId: string; receiverId: string; content: string };

export default function registerChatSocket(io: Server) {
  io.on("connection", (socket: Socket) => {
    // Join personal room for direct messages
    socket.on("chat:join", ({ userId }: JoinPayload) => {
      if (!userId) return;
      socket.join(userRoom(userId));
    });

    // Send direct message: persist then emit to receiver and sender
    socket.on("chat:send", async ({ senderId, receiverId, content }: SendPayload) => {
      if (!senderId || !receiverId || !content) return;
      try {
        const message = await createMessage({ senderId, receiverId, content });
        io.to(userRoom(receiverId)).to(userRoom(senderId)).emit("chat:message", message);
      } catch (error) {
        socket.emit("chat:error", { message: "Failed to send message" });
      }
    });

    socket.on("disconnect", () => {
      // do nothing
    });
  });
}

function userRoom(userId: string) {
  return `user:${userId}`;
}


import http from "http";
import { Server } from "socket.io";
import app from "./app";
import registerChatSocket from "./sockets/chat.socket";

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

// Register socket modules
registerChatSocket(io);

server.listen(PORT, () => {
  console.log(`🚀 Backend is running on http://localhost:${PORT}`);
});

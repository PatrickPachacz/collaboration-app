import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:4000"; // Match with server URL

export const socket = io(SOCKET_URL, {
  transports: ["websocket"],
});

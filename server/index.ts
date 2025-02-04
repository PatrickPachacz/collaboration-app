import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors()); // Allow frontend to connect

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", 
    methods: ["GET", "POST"],
  },
});

let tasks: { id: string; text: string; completed: boolean }[] = [];

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
 
 socket.emit("load-tasks", tasks);

 socket.on("add-task", (taskText) => {
   const newTask = { id: crypto.randomUUID(), text: taskText, completed: false };
   tasks.push(newTask);
   io.emit("task-update", tasks);
 });

 socket.on("complete-task", (taskId) => {
   tasks = tasks.map((task) =>
     task.id === taskId ? { ...task, completed: !task.completed } : task
   );
   io.emit("task-update", tasks);
 });

 socket.on("delete-task", (taskId) => {
   tasks = tasks.filter((task) => task.id !== taskId);
   io.emit("task-update", tasks);
 });

 socket.on("disconnect", () => {
   console.log("A user disconnected");
 });
});

server.listen(4000, () => {
 console.log("Server running on port 4000");
});
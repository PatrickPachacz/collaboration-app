import { useEffect, useState } from "react";
import { socket } from "./socket";
import "./App.css";

type Task = {
  id: string;
  text: string;
  completed: boolean;
  date: string;
  description?: string;
};

function App() {
  const [message, setMessage] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null); 
  const [modalVisible, setModalVisible] = useState(false); 
  const [taskDescription, setTaskDescription] = useState(""); // State for description input
  const [activeUser, setActiveUser] = useState<string | null>(null);

  const users = [
    { image: "https://res.cloudinary.com/dyk0onjht/image/upload/v1738726475/mozart_nyyqzd.png", name: "Mozart" },
    { image: "https://res.cloudinary.com/dyk0onjht/image/upload/v1738726521/debussy_epinnz.jpg", name: "Debussy" },
    { image: "https://res.cloudinary.com/dyk0onjht/image/upload/v1738726529/chopin_g4hqp7.jpg", name: "Chopin" }
  ];
  

  const handleUserSelect = (userName: string) => {
    setActiveUser(userName);
  };
  

  useEffect(() => {
    socket.on("load-tasks", (loadedTasks: Task[]) => setTasks(loadedTasks));
    socket.on("task-update", (updatedTasks: Task[]) => setTasks(updatedTasks));

    return () => {
      socket.off("load-tasks");
      socket.off("task-update");
    };
  }, []);

  const addTask = () => {
    if (!activeUser) {
      alert("Please select a user first!");
      return;
    }
  
    if (message.trim() !== "") {
      const newTask = {
        id: Date.now().toString(),
        text: message,
        completed: false,
        description: taskDescription,
        date: new Date().toLocaleDateString(),
        user: activeUser 
      };
      setTasks([...tasks, newTask]);
      setMessage("");
    }
  };

  
  const toggleCompleteTask = (id: string) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === id) {
        return { ...task, completed: !task.completed }; 
      }
      return task; 
    });
  
    setTasks(updatedTasks); 
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  
  };
  

  
  return (
    <div className="container">
      <div className="layout">
      <div className="left-panel">
      <h2 className="user-header">Select a User</h2>
        <ul className="user-list">
          {users.map((user) => (
            <li
              key={user.name}
              className={`user-item ${activeUser === user.name ? "active" : ""}`}
              onClick={() => handleUserSelect(user.name)}
            >
             <img src={user.image} alt={user.name} className="user-avatar" />
             <span>{user.name}</span>
            </li>
          ))}
        </ul>
      </div>

        <div className="center-panel">
          <h1 className="title">Collaboration App</h1>
          {activeUser && <h2>Logged in as: {activeUser}</h2>}
          <div className="input-container">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter a task..."
              className="input"
            />
            <textarea
             value={taskDescription}
             onChange={(e) => setTaskDescription(e.target.value)}
             placeholder="Enter a task description..."
             className="input-description"
             
            />
            <button onClick={addTask} className="add-button">
              Add Task
            </button>
          </div>
          
             <h2 className="subtitle">Tasks:</h2>
             
             <div className="task-list-container">
             <ul className="task-list">
         {tasks.map((task) => (
           <li key={task.id} className="task-item">
              <span className="task-date">{task.date}</span> 
              <span
                className="task-text"
                style={{ textDecoration: task.completed ? "line-through" : "none",
                  whiteSpace: "nowrap", 
                  overflow: "hidden",   
                  textOverflow: "ellipsis",
                  cursor: "pointer", 
                 }}
                 onClick={() => {
                 setSelectedTask(task); 
                setModalVisible(true); 
                }}
             >
                {task.text.length > 20 ? task.text.slice(0, 20) + "..." : task.text}
              </span>
              <div>
                <button onClick={() => toggleCompleteTask(task.id)} className="complete-button">
                  ✅
                </button>
                <button onClick={() => deleteTask(task.id)} className="delete-button">
                  🗑️
                </button>
             </div>
            </li>
          ))}
        </ul>
        </div>
        </div>
        <div className="right-panel"></div>
      </div>


      {modalVisible && selectedTask && (
       <div className="modal-overlay">
         <div className="modal-content">
           <h2>Task Description</h2>
           <p>{selectedTask.description || "No description available."}</p>
           <button onClick={() => setModalVisible(false)} className="close-modal-button">
             Close
           </button>
         </div>
        </div>
      )}
         </div>
        );
      }

export default App;
// frontend/src/utils/socket.ts
import { io, Socket } from "socket.io-client";
import { addNotification } from "../store/Slice/NotificationSlice";
import { store } from "../store/store";
import { toast } from "react-toastify";


let socket: Socket | null = null;


export const initSocket = (userId: string, token: string) => {
    console.log(userId,"userId",token,"jkkhdafh")
  if (socket) {
    socket.disconnect(); // Disconnect any existing socket
  }


  socket = io(import.meta.env.VITE_BACKEND_URL, {
    query: { token },
    transports: ["websocket"],
    reconnection: true, // Enable reconnection
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });
 










  

  socket.on("connect", () => {
    console.log("Connected to Socket.IO server:", socket?.id);
    socket?.emit("join", userId); // Ensure the client joins the user-specific room
  });


  socket.on("notification", (notification) => {
    console.log("Received notification:", notification);
    store.dispatch(
      addNotification({
        id: notification.id,
        user: notification.sender?.username || "Unknown",
        time: notification.createdAt,
        message: notification.message,
      })
    );
    toast.info(notification.message, { autoClose: 5000 }); // Show toast for new notifications
  });


  socket.on("connect_error", (error) => {
    console.error("Socket connection error:", error);
    toast.error("Failed to connect to notification server. Retrying...");
  });


  socket.on("error", (error) => {
    console.error("Socket error:", error.message);
    toast.error(error.message);
    if (error.message.includes("token")) {
      // Optionally redirect to login
      store.dispatch({ type: "auth/logout" }); // Adjust based on your auth slice
    }
  });


  socket.on("disconnect", () => {
    console.log("Disconnected from Socket.IO server");
    // toast.warn("Disconnected from notification server. Reconnecting...");
  });


  return socket;
};


export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};


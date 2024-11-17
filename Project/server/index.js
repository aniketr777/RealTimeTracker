// server.js
const express = require("express");
const app = express();
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const server = http.createServer(app);
const io = socketio(server);

let clients = {}; // To store client names and locations

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "client/build"))); // Update path to your React app build folder

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Emit all existing locations to the newly connected user
  socket.emit("all-locations", clients);

  // Handle location updates from users
  socket.on("send-location", (data) => {
    // Store user's location and name
    clients[socket.id] = {
      name: data.name,
      latitude: data.latitude,
      longitude: data.longitude,
    };

    // Broadcast the updated location to all clients
    io.emit("receive-location", {
      id: socket.id,
      name: data.name,
      latitude: data.latitude,
      longitude: data.longitude,
    });
  });

  // Handle user disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    delete clients[socket.id]; // Clean up on disconnection
    io.emit("user-disconnected", socket.id);
  });
});

// Serve the React app for any other requests
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build", "index.html")); // Update path to your React app build folder
});

const PORT = process.env.PORT || 3000; // Use environment variable for PORT
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

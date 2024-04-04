const express = require("express")
const http = require("http")
const app = express()
const server = http.createServer(app)
const io = require("socket.io")(server, {
	cors: {
		origin: "https://rahullocation.netlify.app",
		//origin: "http://localhost:3000",
		methods: [ "GET", "POST" ]
	}
})



// Simulated database storing users' locations
const usersLocations = {};

// Socket.io event handler
io.on('connection', (socket) => {
  console.log('User connected');

  // Listen for 'location' event from clients
  socket.on('location', (data) => {
    const { latitude, longitude } = data;
    const userId = socket.id; // Use socket id as userId for simplicity
    usersLocations[userId] = { latitude, longitude };

    // Broadcast updated location to all connected clients
    io.emit('friendsLocations', getUsersLocations());
  });

  // Emit initial friends' locations when a new user connects
  io.emit('friendsLocations', getUsersLocations());

  // Handle user disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected');
    delete usersLocations[socket.id];
    io.emit('friendsLocations', getUsersLocations());
  });
});

// Helper function to get users' locations
function getUsersLocations() {
  return Object.keys(usersLocations).map((userId) => ({
    id: userId,
    latitude: usersLocations[userId].latitude,
    longitude: usersLocations[userId].longitude,
  }));
}


// io.on("connection", (socket) => {
//     console.log('A user connected');


// // Handle drawing events
// socket.on('draw', (data) => {
//     console.log('Drawing event received:', data);
//     // Broadcast drawing data to all clients except the sender
//     socket.broadcast.emit('draw', data);
//   });


    
// 	socket.on("disconnect", () => {
//     console.log('User disconnect...') 
// 	})


// })

server.listen(5000, () => console.log("server is running on port 5000"))



// Simulate friends' movements
setInterval(() => {
	Object.keys(usersLocations).forEach((userId) => {
	  usersLocations[userId].latitude += Math.random() * 0.01 - 0.005;
	  usersLocations[userId].longitude += Math.random() * 0.01 - 0.005;
	});
	io.emit('friendsLocations', getUsersLocations());
  }, 5000); // Update friends' locations every 5 seconds (for demonstration)
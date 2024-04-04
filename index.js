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



io.on("connection", (socket) => {
    console.log('User Join')





    
	socket.on("disconnect", () => {
    console.log('User disconnect...') 
	})


})

server.listen(5000, () => console.log("server is running on port 5000"))
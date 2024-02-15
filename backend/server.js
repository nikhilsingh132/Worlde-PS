const express = require('express');
const http = require('http');
const {Server} = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server,{
    cors:{
        origin:'http://localhost:3000',
        methods:["GET","POST"]
    }
})

app.use(cors());

let totaluser = 0;

io.on('connection', (socket) => {
    console.log("hello");
    totaluser++;
    io.emit('user-count', totaluser);

    socket.on('message', (data) => {
        io.emit('chat-message', data);
    });

    socket.on('disconnect', () => {
        totaluser--;
        io.emit('user-count', totaluser);
    });
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

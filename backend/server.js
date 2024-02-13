const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(cors());

let totalClients = 0;

io.on('connection', (socket) => {
    totalClients++;
    io.emit('clients-total', totalClients);

    socket.on('message', (data) => {
        io.emit('chat-message', data);
    });

    socket.on('feedback', (data) => {
        io.emit('feedback', data);
    });

    socket.on('disconnect', () => {
        totalClients--;
        io.emit('clients-total', totalClients);
    });
    console.log("hello")
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

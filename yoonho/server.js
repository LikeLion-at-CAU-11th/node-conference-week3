// server.js

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);

const io = socketIo(server);
const PORT = 8000;

var clientList = [];

io.on('connection', (socket) => {

    socket.on('registerName', (clientName) => {
        socket.clientName = clientName;
        clientList[socket.clientName] = socket.id;          // 사용자 식별 id 저장
        console.log(`User ${clientName} connected`);
    });

    socket.on('message', (data) => {
        console.log(`${socket.clientName}: ${data.msg}`);
        const message = `${socket.clientName}: ${data.msg}`;
        if(clientList[data.receiver] != undefined){
            socket.to(clientList[data.receiver]).emit('message', message);      // 해당 수신자에게만 전송
        }
        else{   
            socket.broadcast.emit('message', message);
        }
    });

    socket.on('disconnect', (reason) => {
        if (socket.clientName) {
            io.emit('message', `<SERVER : ${socket.clientName} disconnected>`);
            console.log(`User ${socket.clientName} disconnected: ${reason}`);
        } else {
            console.log(`User disconnected: ${reason}`);
        }
    });
});

server.listen(PORT, () => {
    console.log(`listening on : ${PORT}`);
});
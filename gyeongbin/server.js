// server.js

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);

const io = socketIo(server);
const PORT = 8000;

const clients = [];

io.on('connection', (socket) => {

    socket.on('registerName', (clientName) => {
        socket.clientName = clientName;
        clients.push({clientName : clientName, clientID : socket.id});
        console.log(`User ${clientName} connected`);
        console.log(clients);
    });

    socket.on('audience', (receivePerson) => {
        socket.audience = receivePerson;
        for (let i=0; i<clients.length; i++){
            if(clients[i].clientName === receivePerson) {
                socket.audienceID = clients[i].clientID;
            }
        }
        console.log(socket.audienceID);
        console.log(`${socket.clientName} whispering to ${receivePerson}`);
    }) 

    socket.on('message', (data) => {
        if (socket.audience === 'all') {
            console.log(`${socket.clientName}: ${data.msg}`);
            const message = `${socket.clientName}: ${data.msg}`;
            socket.broadcast.emit('message', message);
        } else {
            console.log(`${socket.clientName} > ${socket.audience}: ${data.msg}`);
            const message = `[whisper]${socket.clientName}: ${data.msg}`;
            console.log(socket.audienceID);
            io.to(socket.audienceID).emit('message', message);
        }
    });

    socket.on("disconnect", (reason) => {
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
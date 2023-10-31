const express = require("express");
const http = require("http");
const socketIo = require("socket.io"); //웹소켓 서버 생성 - http 서버 위에서 동작


const app = express();
const server = http.createServer(app);

const io = socketIo(server);
const PORT = 8000;

const userList = {};

io.on("connection", (socket)=>{
    //클라이언트가 registerName 이벤트 보내면 호출되는 이벤트 핸들러
    socket.on("resgisterName", (userName)=>{
        // 클라이언트가 보낸 이름을 소켓 객체에 저장하고, list에 연결하여 저장
        socket.userName = userName;
        userList[socket.userName] = socket.id; //사용자 식별 id 저장
        console.log(`User ${userName} connected`);
    });

    socket.on('message', (data)=>{
        console.log(`${socket.userName} : ${data.msg}` );
        const message = `${socket.userName} : ${data.msg}`;
        if(client[data.receiver] != undefined){
            socket.to(clientList[data.receiver]).emit('message', message);
        }
    });

    socket.on("disconnect", (reason)=>{
        if(socket.userName){
            io.emit('message', `<SERVER : ${socket.userName} disconnected`);
            delete userList[socket.userName];
        }
        else{
            console.log(`User disconnected : ${reason}`);
        }
    });

});

server.listen(PORT, ()=>{
    console.log('listening on : ${PORT}');
})
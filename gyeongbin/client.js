//client.js

const io = require('socket.io-client');

const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const serverAddress = "http://localhost:8000";

const socket = io.connect(serverAddress);

rl.question("Enter your username:", (clientName)=>{
    socket.emit(`registerName`, clientName);
    console.log(`registered as ${clientName}`);
    rl.question("send a message to all or someone?(all/someone name) : ", (receivePerson)=>{
        socket.emit(`audience`, receivePerson);
        console.log(`You whispering with ${receivePerson}`);
    });
});

socket.on('connect', ()=>{
    //양쪽 연결되어 있으면 항상 발생함 : 채팅을 연속적으로 보낼 수 있어야 함
    rl.on('line', (input)=>{
        if(input === "quit") {
            socket.disconnect();
            process.exit();
        } else {
            const data = {
                msg: input
            };
            socket.emit('message', data);
        }
    })
});

socket.on('message', (data)=>{
    console.log(data);
});

socket.on('disconnect', (reason)=>{
    console.log(`Disconnected from server : ${reason}`);
});


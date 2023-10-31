const io = require("socket.io-client");

const readline = require("readline");

const rl = readline.createInterface({//인터페이스 설정
    input: process.stdin,
    output: process.stdout
});

const serverAddress = "http://localhost:8000";

const socket = io.connect(serverAddress);

rl.question("Enter your username : ", (clientName)=>{
    socket.emit('registerName', clientName);
    console.log('registered as ${clientName');
});

socket.on('connect', ()=>{ // 연결되어있으면 항상 발생 (상시 유지)
    rl.on('line', (input)=>{
        if(input == "quit"){
            socket.disconnect();
        }
        else{
            const data = {
                msg : input
            };
            socket.emit("message", data); //메시지 보내기
        }
    })
});

socket.on('message', (data)=>{ // 들음
    console.log(data);
});

socket.on('disconnect', (reason)=>{
    console.log(`Disconnected from server : ${reason}`);
});
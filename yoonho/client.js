const io = require("socket.io-client");

const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const serverAddress = "http://localhost:8000";

const socket = io.connect(serverAddress);

rl.question("Enter your username:", (clientName) => {
    socket.emit('registerName', clientName);
    console.log(`registered as ${clientName}`);
});

socket.on('connect', () => { 
    rl.on('line', (input) => {          // "수신자_닉네임 < 메세지" 형식 입력 가정
        var input = input.split("<");       
        if (input == "quit") {
            socket.disconnect();
            process.exit(0);
        }
        else {
            const data = {
                receiver: input[0].trim(),
                msg: input[1].trim(),
            };
            socket.emit('message', data);
        }
    });
});

socket.on('message', (data) => {
    console.log(data);
});

socket.on('disconnect', (reason) => {
    console.log(`Disconnected from server : ${reason}`);
});
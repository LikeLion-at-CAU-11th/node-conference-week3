const io = require("socket.io-client");

const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const serverAddress = "http://localhost:8000";

const socket = io.connect(serverAddress);

rl.question("Enter your username:", (clientName) => {
  socket.emit("registerName", clientName);
  console.log(`registered as ${clientName}`);
});

socket.on("connect", () => {
  rl.on("line", (input) => {
    const inputData = input.split(" ");
    const data = {
      target: inputData[0],
      msg: inputData[1],
    };

    if (input == "quit") {
      socket.disconnect();
      process.exit(0);
    } else {
      socket.emit("message", data);
    }
  });
});

socket.on("message", (message) => {
  console.log(message);
});

socket.on("disconnect", (reason) => {
  console.log(`Disconnected from server : ${reason}`);
});

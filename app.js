const express = require("express");
const socket = require("socket.io");

const app = express();

//display frontend
app.use(express.static("public"));

let port = process.env.PORT || 3000;

let server = app.listen(port, ()=>{
    console.log("listening to port " + port)
})

const io = socket(server);

io.on("connection" , (socket)=>{
    console.log("made socket connection");

    socket.on("beginpath", (data)=>{
        io.sockets.emit("beginpath", data);
    })

    socket.on("drawstroke", (data) => {
        io.sockets.emit("drawstroke", data);
    })

    socket.on("redoundo", (data) => {
        io.sockets.emit("redoundo", data);
    })
})

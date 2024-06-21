let canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let pencilClr = document.querySelectorAll(".color");
let pencilWidth = document.querySelector(".pencilwidth");
let erWidth = document.querySelector(".erwidth");
let download = document.querySelector(".download");
let undo = document.querySelector(".undo");
let redo = document.querySelector(".redo");

let penclr = "red";
let erclr = "white";
let penWidth = pencilWidth.value;
let erwidth = erWidth.value;

let undoredoarr = [];
let track = 0;

let eraserflag = false;

//API for all graphics
let tool = canvas.getContext("2d");

tool.strokeStyle = penclr;
tool.lineWidth = penWidth;

//mousedown -> start new path
//mousemove -> fill path

let mousedown = false;

canvas.addEventListener("mousedown", (e)=>{
    mousedown = true;

    let data = {
        x : e.clientX,
        y : e.clientY
    }
    socket.emit("beginpath", data);

})

function beginPath(data){
    tool.beginPath();
    tool.moveTo(data.x, data.y);
}

function drawStroke(data){
    tool.strokeStyle = data.color;
    tool.lineWidth = data.width;
    tool.lineTo(data.x,data.y);
    tool.stroke();
}

canvas.addEventListener("mousemove", (e)=>{
    if(mousedown)
    {
        let data = {
            x : e.clientX,
            y : e.clientY,

            color : eraserflag ? erclr : penclr,
            width : eraserflag ? erwidth : penWidth
        }

        socket.emit("drawstroke", data)
    }
})

canvas.addEventListener("mouseup", ()=>{
    mousedown = false;

    let url = canvas.toDataURL();
    undoredoarr.push(url);
    track = undoredoarr.length - 1;
})

pencilWidth.addEventListener("change", ()=>{
    penWidth = pencilWidth.value;
    tool.lineWidth = penWidth;
})

erWidth.addEventListener("change", ()=>{
    erwidth = erWidth.value;
    tool.lineWidth = erwidth;
})

pencilClr.forEach((clr)=>{
    clr.addEventListener("click", ()=>{
        let colour = clr.classList[0];
        penclr = colour;
        tool.strokeStyle = penclr;
    })
})

eraserIcon.addEventListener("click", ()=>{
    eraserflag = !eraserflag

    if(eraserflag){
        tool.strokeStyle = erclr;
        tool.lineWidth = erwidth;
    }
    else{
        tool.strokeStyle = penclr;
        tool.lineWidth = penWidth;
    }
})

pencilIcon.addEventListener("click" , ()=>{
    tool.strokeStyle = penclr;
    tool.lineWidth = penWidth;
})

download.addEventListener("click", ()=>{
    let url = canvas.toDataURL();

    let a = document.createElement("a");
    a.href = url;
    a.download = "board.jpg";
    a.click();
})

undo.addEventListener("click", ()=>{
    if(track > 0){
        track--;
    }

    let data = {
        trackValue : track,
        undoredoarr : undoredoarr
    }

    // undoredocanvas(trackobj);

    socket.emit("redoundo" , data);
})
redo.addEventListener("click", ()=>{
    if(track < undoredoarr.length - 1){
        track++;
    }
    let data = {
        trackValue : track,
        undoredoarr : undoredoarr
    }

    // undoredocanvas(trackobj);

    socket.emit("redoundo", data);
})

function undoredocanvas(trackobj){

    let track = trackobj.trackValue;
    undoredoarr = trackobj.undoredoarr;

    let url = undoredoarr[track];
    let img = new Image();
    img.src = url;
    img.onload = (e) => {
        tool.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
}

socket.on("beginpath", (data)=>{
    //data from server
    beginPath(data);
})
socket.on("drawstroke", (data)=>{
    //data from server
    drawStroke(data);
})
socket.on("redoundo", (data)=>{
    //data from server
    undoredocanvas(data);
})

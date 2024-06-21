let options = document.querySelector(".options")
let lines = document.querySelector(".lines")
let items = document.querySelector(".items")
let pencil = document.querySelector(".pencil-cont")
let eraser = document.querySelector(".eraser-cont")
let pencilIcon = document.querySelector(".pencil")
let eraserIcon = document.querySelector(".eraser")
let stickyCont = document.querySelector(".sticky-cont")
let stickyIcon = document.querySelector(".notes")
let upload = document.querySelector(".upload")
let flag = true;
let penflag = false;
let erflag = false;

closePen();
closeEr();


options.addEventListener("click", (e)=>{
    flag = !flag;

    if(flag)
    {
        onOption();
    }
    else{
        closeOption();
    }
})

function onOption(){
    lines.classList.remove("fa-xmark");
    lines.classList.add("fa-bars")
    items.style.visibility = "visible";
    pencil.style.visibility = "visible";
    eraser.style.visibility = "visible";
    items.classList.add("animate-item");
}

function closeOption(){
    lines.classList.remove("fa-bars");
    lines.classList.add("fa-xmark");
    items.style.visibility = "hidden";
    pencil.style.visibility = "hidden";
    eraser.style.visibility = "hidden";
    items.classList.remove("animate-item");
}

pencilIcon.addEventListener("click", (e)=>{
    penflag = !penflag;

    if(penflag)
    {
        onPen();
    }
    else{
        closePen();
    }
})

function onPen(){
    pencil.style.display = "flex";
}
function closePen(){
    pencil.style.display = "none";
}

eraserIcon.addEventListener("click", (e)=>{
    erflag = !erflag;

    if(erflag)
    {
        onEr();
    }
    else{
        closeEr();
    }
})

function onEr(){
    eraser.style.display = "flex";
}
function closeEr(){
    eraser.style.display = "none";
}

stickyIcon.addEventListener("click", (e)=>{
    let newSticky = document.createElement('div');
    newSticky.setAttribute("class", "sticky-cont");

    newSticky.innerHTML = `
    <div class="sticky-cont">
        <div class="header">
            <div class="minimize"> </div>
            <div class="removeS"> </div>
        </div>
        <textarea class = "note-cont" spellcheck = "false"></textarea>
    </div>
    `
    document.body.appendChild(newSticky);

    let removeS = newSticky.querySelector(".removeS");
    let minimize = newSticky.querySelector(".minimize");

    console.log("removeS:", removeS);
    console.log("minimize:", minimize);

    notesFunctionality(newSticky, removeS, minimize);

    newSticky.onmousedown = function(event){
        dragAndDrop(event, newSticky);
    }
    newSticky.ondragstart = function(){
        return false;
    };
})

function notesFunctionality(newSticky, removeS, minimize){

    console.log("triggered");

    removeS.addEventListener("click", (e)=>{
        console.log("remove");
        newSticky.remove();
    })

    minimize.addEventListener("click", (e)=>{
        console.log("minimize");
        let area = newSticky.querySelector(".note-cont");
        let currDisplay = getComputedStyle(area).getPropertyValue("display");

        if(currDisplay == "none")
        {
            area.style.display = "block";
        }
        else{
            area.style.display = "none"
        }
    })
}

function dragAndDrop(event, ball)
{
    let shiftX = event.clientX - ball.getBoundingClientRect().left;
    let shiftY = event.clientY - ball.getBoundingClientRect().top;
    
    ball.style.position = 'absolute';
    ball.style.zIndex = 1000;
    
    moveAt(event.pageX, event.pageY);
    
    // moves the ball at (pageX, pageY) coordinates
    // taking initial shifts into account
    function moveAt(pageX, pageY) {
        ball.style.left = pageX - shiftX + 'px';
        ball.style.top = pageY - shiftY + 'px';
    }
    
    function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
    }
    
    // move the ball on mousemove
    document.addEventListener('mousemove', onMouseMove);
    
    // drop the ball, remove unneeded handlers
    ball.onmouseup = function() {
        document.removeEventListener('mousemove', onMouseMove);
        ball.onmouseup = null;
    };
}

upload.addEventListener("click", (e)=>{
    //open file explorer
    let input = document.createElement("input");
    input.setAttribute("type", "file");
    input.click();

    input.addEventListener("change", (e)=>{
        let file = input.files[0];
        let url = URL.createObjectURL(file);

        let newSticky = document.createElement("div");
        newSticky.setAttribute("class", "sticky-cont");

        newSticky.innerHTML = `
        <div class="sticky-cont">
            <div class="header">
                <div class="minimize"> </div>
                <div class="removeS"> </div>
            </div>
            <img src="${url}" class = "note-cont">
        </div>
        `
        document.body.appendChild(newSticky);
    
        let removeS = newSticky.querySelector(".removeS");
        let minimize = newSticky.querySelector(".minimize");
    
        console.log("removeS:", removeS);
        console.log("minimize:", minimize);
    
        notesFunctionality(newSticky, removeS, minimize);
    
        newSticky.onmousedown = function(event){
            dragAndDrop(event, newSticky);
        }
        newSticky.ondragstart = function(){
            return false;
        };
    })
})
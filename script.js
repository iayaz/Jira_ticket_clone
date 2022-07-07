let addbtn = document.querySelector(".add-btn");
let removebtn = document.querySelector(".remove-btn");
let modalCont  = document.querySelector(".modal-cont");
let mainCont = document.querySelector(".main-cont");
let addFlag = false;
let removeFlag = false;
let textareaCont = document.querySelector(".textarea-cont");
let colors = ["lightpink" ,"lightblue" , "lightgreen" ,"black"];
let modalPriorityColor = colors[colors.length -1];
let allPriorityColor = document.querySelectorAll(".priority-color");
let lockClass = "fa-lock";
let unlockClass = "fa-lock-open";
let toolBoxColors = document.querySelectorAll(".color");
let ticketArr = [];

if(localStorage.getItem("jira_tickets")){
    //Retrieve and display tickets
    ticketArr = JSON.parse(localStorage.getItem("jira_tickets"));
    ticketArr.forEach((ticketObj) => {
        createTicket(ticketObj.ticketColor , ticketObj.ticketTask , ticketObj.ticketID );
    })
}

//listener for modal coloring
allPriorityColor.forEach((colorElem,idx)=>{
    colorElem.addEventListener("click",(e)=>{
        allPriorityColor.forEach((priorityColorElem,idx)=>{
            priorityColorElem.classList.remove("border");
        })
        colorElem.classList.add("border");
        modalPriorityColor = colorElem.classList[0];
    })
})



addbtn.addEventListener("click" , (e) => {
// Display Modal
// Generate Tkt
//addflag = true -> modal display

addFlag = !addFlag
console.log(addFlag);
if(addFlag){
modalCont.style.display = "flex";
}
//addflag=false ->modal None
else{
    modalCont.style.display = "none";
}
})
modalCont.addEventListener("keydown",(e)=>{
    let key = e.key;
    if(key=="Shift"){
        createTicket(modalPriorityColor,textareaCont.value);
       setModalToDefault();
        textareaCont.value ="";
    }
})
function createTicket(ticketColor,ticketTask,ticketID){
    let id = ticketID || shortid();
    let ticketCont = document.createElement("div");
    ticketCont.setAttribute("class","ticket-cont");
    ticketCont.innerHTML=`<div class="ticket-color ${ticketColor}"></div>
    <div class="ticket-id">#${id}</div>
    <div class="task-area">${ticketTask}</div>
    <div class="ticket-lock">
    <i class="fa-solid fa-lock"></i>
    </div>
`;
mainCont.appendChild(ticketCont);
//Create object of tkt and add to array
if(!ticketID){

    ticketArr.push({ticketColor,ticketTask,ticketID: id});
    localStorage.setItem("jira_tickets" , JSON.stringify(ticketArr));
}



handleRemoval(ticketCont , id);
handleLock(ticketCont , id);
handleColor(ticketCont , id);

}

function handleRemoval(ticket , id){
    //RemoveFlag ->True -> remove
    ticket.addEventListener("click" , (e) =>{
        if(removeFlag){
            let idx = getTicketidx(id);

            //DB Removal
            ticketArr.splice(idx,1);
            let strTicketsArr = JSON.stringify(ticketArr);
            localStorage.setItem("jira_tickets" , strTicketsArr);
    
            ticket.remove();// UI Removal
        }
    })
    
}

removebtn.addEventListener("click",(e)=>{
    removeFlag =  !removeFlag;
    //console.log(removeFlag);
})

function handleLock(ticket , Id){
    let lockElem = ticket.querySelector(".ticket-lock");
    let ticketLock = lockElem.children[0];
    let ticketTaskArea = ticket.querySelector(".task-area");
    ticketLock.addEventListener("click",(e)=>{
        let ticketIdx = getTicketidx(Id);
        if(ticketLock.classList.contains(lockClass)){
            ticketLock.classList.remove(lockClass);
            ticketLock.classList.add(unlockClass)
            ticketTaskArea.setAttribute("contenteditable","true");
        }
        else{
            ticketLock.classList.remove(unlockClass);
            ticketLock.classList.add(lockClass);
            ticketTaskArea.setAttribute("contenteditable","false");
        }
        //Modify data in local storage  //Ticket tAsk//

        ticketArr[ticketIdx].ticketTask = ticketTaskArea.innerText;
        localStorage.setItem("jira_tickets" , JSON.stringify(ticketArr)); 
    })
}

function handleColor(ticket,id){
    let ticketColor = ticket.querySelector(".ticket-color");
    ticketColor.addEventListener("click", (e)=>{
        //get ticket index from tkt array
        let ticketIdx = getTicketidx(id);

        let currentTicketColor = ticketColor.classList[1];
    // Get Ticket Color Index
    let currentTicketColorIdx = colors.findIndex((color)=>{
        return currentTicketColor === color;
    })
    currentTicketColorIdx++;
    let newTicketColorIdx = currentTicketColorIdx % colors.length;
    let newTicketColor = colors[newTicketColorIdx];
    ticketColor.classList.remove(currentTicketColor);
    ticketColor.classList.add(newTicketColor);

    
    // Modify data in local storage(priority color change)
    ticketArr[ticketIdx].ticketColor = newTicketColor ;
    localStorage.setItem("jira_tickets",JSON.stringify(ticketArr));
    })
    
}
function getTicketidx(id){
    let ticketIdx = ticketArr.findIndex((ticketObj) =>{
        return ticketObj.ticketID === id;
    })
    return ticketIdx;
}

for(let  i = 0 ; i < toolBoxColors.length ; i++){
    toolBoxColors[i].addEventListener("click", (e)=>{
        let currentToolBoxColor = toolBoxColors[i].classList[0];

        let filteredTickets = ticketArr.filter((ticketObj,idx)=>{
            return currentToolBoxColor === ticketObj.ticketColor;
        })
        //Remove previous Ticket
        let allTicketCont = document.querySelectorAll(".ticket-cont");
        for(let i =  0 ; i < allTicketCont.length ; i++){
            allTicketCont[i].remove();
        }
        // Display new Filtered Tickets
        filteredTickets.forEach((ticketObj,idx)=>{
            createTicket(ticketObj.ticketColor , ticketObj.ticketTask , ticketObj.ticketID);
        })
    })

    toolBoxColors[i].addEventListener("dblclick",(e)=> {
        let allTicketCont = document.querySelectorAll(".ticket-cont");
        for(let  i = 0 ; i < allTicketCont.length ; i++){
            allTicketCont[i].remove();
        }
        ticketArr.forEach((ticketObj,idx) => {
            createTicket(ticketObj.ticketColor, ticketObj.ticketTask, ticketObj.ticketID);
        })
    })
}

function setModalToDefault(){
    modalCont.style.display = "none";
    addFlag = false;
    modalPriorityColor = colors[colors.length-1];
    allPriorityColor.forEach((priorityColorElem , idx) => {
        priorityColorElem.classList.remove("border");
    })
    allPriorityColor[allPriorityColor.length-1].classList.add("border");
}



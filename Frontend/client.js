const chatMessages = document.querySelector('.chat-messages')
const chatForm = document.getElementById('chat-form')
const roomName = document.getElementById('room-name')
const userList = document.getElementById('users')

let urlParams = new URLSearchParams(window.location.search);
const username = urlParams.get("username")
const room = urlParams.get("room")
console.log(username, room);

const socket = io("https://chat-app-7pse.onrender.com/", { transports: ["websocket"] });

socket.emit('joinRoom', { username, room })

socket.on('message', (message) => {
    outputMessage(message)
    chatMessages.scrollTop = chatMessages.scrollHeight
})

socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room)
    outputRoomUsers(users)
})

chatForm.addEventListener('submit', (e) => {
    e.preventDefault()
    let msg = e.target.elements.msg.value
    console.log(msg);
    msg = msg.trim()
    if (!msg) {
        return false
    }
    socket.emit('chatMessage', msg)
    e.target.elements.msg.value = ''
    e.target.elements.msg.focus()
})

function outputMessage(message) {
    const div = document.createElement('div')
    div.classList.add('message')
    div.setAttribute('class', "textColor")
    if(username!=message.username){
        div.style.textAlign="left";
    }
    else {
        div.style.textAlign="right";
    }
    const p = document.createElement('p')
    p.classList.add('meta')
    p.innerText = message.username
    p.innerHTML += `<span> ${message.time}</span>`
    div.appendChild(p)

    const para = document.createElement('p')
    para.classList.add('text')
    para.innerText = message.text

    div.appendChild(para)
    chatMessages.appendChild(div)
}

function outputRoomName(room) {
    roomName.innerText = room
}

function outputRoomUsers(users) {
    userList.innerHTML = ''
    users.forEach(user => {
        const li = document.createElement('li')
        li.innerText = user.username
        userList.appendChild(li)
    })
}

document.getElementById('leave-btn').addEventListener('click', (e) => {
    const leaveRoom = confirm('are you sure you want to leave the Chat Room ?')
    if (leaveRoom) {
        window.location.href = './index.html'
    }
})


getdata();

async function getdata(){
    console.log(room);
    try {
        let response = await fetch("https://chat-app-7pse.onrender.com/data/",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({"rooms":room})
        });

        let data = await response.json();
        console.log(data);
        display(data);
    } catch (error) {
        alert(error);
    }
}


function display(data){
    for(let i=0;i<data.length;i++){
        outputMessage(data[i]);
    }
}
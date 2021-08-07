const socket = io();

let container = document.querySelector(".container");
let messageInp = document.getElementById("messageInp");
let sendBtn = document.getElementById("sendBtn");
let messageForm = document.getElementById("messageForm");

var audio = new Audio("./media/notification.mp3");

// Creating a append function that will append messages in the container
const append = (message, position) => {
  let div = document.createElement("div");
  div.innerText = `${message}`;
  div.classList.add("message");
  div.classList.add(position);
  container.appendChild(div);
  if (position === "left") {
    audio.play();
  }
};

// Emit to server that new user joined
const username = prompt("Enter your name to join the chat");
console.log(username, typeof username);
if (username.trim() === "") {
  alert("Enter a valid name");
} else {
  socket.emit("new-user-joined", username);
  socket.on("user-joined", (name) => {
    append(`${name} joined the chat`, "center");
  });
}

// Emit message to server sent by any user
messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let message = messageInp.value;
  append(`You: ${message}`, "right");
  socket.emit("send", message);
  messageInp.value = "";
});

// Appending message in the container after receiving from the server
socket.on("receive", (data) => {
  console.log(data);
  append(`${data.name}: ${data.message}`, "left");
});

// Show left message if certain socket got disconnected
socket.on("left", (name) => {
  append(`${name} left the chat`, `center`);
});

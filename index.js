// Node server which will handle socket io connection
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const hostname = '192.168.43.249' || 'localhost';
const port = 3000;

// setting the static files folders
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + 'public/index.html');
});

const users = {}

io.on('connection', socket=>{
  // If new user joins let other joined users know
  socket.on('new-user-joined', name=>{
    users[socket.id] = name;
    socket.broadcast.emit('user-joined', name)
  })
  // If user sends a message brtoadcast it to other joined users
  socket.on('send', message=>{
    socket.broadcast.emit('receive', {message:message, name:users[socket.id]})
  })

  // If any user disconnects let the other users know
  socket.on('disconnect', message =>{
    socket.broadcast.emit('left', users[socket.id]);
    delete users[socket.id];
});
})


server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);})


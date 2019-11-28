const io = require('socket.io')(3000); //inicia servidor na porta 300

const users = {};
var usuarios = [];

io.on('connection', socket => {

    //quando um usuario se conecta à porta, envia uma mensagem para todos outros usuarios que alguem se conectou
    //adiciona usuario na lista de usuarios online e envia para usuarios
    socket.on('new-user', name=>{ 
        users[socket.id] = name;
        socket.broadcast.emit('user-connected', name)  
        io.to(socket.id).emit( 'primeiraLista', {usuarios: usuarios} );
        usuarios.push(name)
    })

    //recebe uma mensagem de texto de um usuario e envia para todos outros usuarios via broadcast
    socket.on('send-chat-message',message =>{
        socket.broadcast.emit('chat-message', {message: message, name: users[socket.id]})
    })

    //caso um usuario se desconectar, deleta usuario da lista e avisa demais usuarios que um usuario se desconectou
    socket.on('disconnect', ()=>{
        socket.broadcast.emit('user-disconnected',users[socket.id])
        var indice = usuarios.indexOf(users[socket.id])
        usuarios.splice(indice,1);
        delete users[socket.id] 
        
    })
})
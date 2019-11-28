const socket = io('http://localhost:3000') //se conecta na porta 3000
const messageContainer = document.getElementById('message-container')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')
const usuariosOnline = document.getElementById('usuarios-online')

var users = []
const name = prompt('Qual seu nome?');
users.push(name)
appendMessage('Você entrou!');
socket.emit('new-user',name)
var text = "";
refreshLista();

//Funcao recebe um objeto data com o nome do emissor e a menssagem e envia para a função appendMessage(nome, texto)
socket.on('chat-message', data =>{
    appendMessage(`${data.name}: ${data.message}`);
})

//recebe uma lista com os usuarios onlines no momento
socket.on('primeiraLista', text =>{
    var i;
    for(i=0;i<text.usuarios.length;i++){
        users.push(text.usuarios[i])
    }
    refreshLista();
})

//Recebe o nome de um usuario que acabou de conectar na sala de chat
socket.on('user-connected', name =>{
    appendMessage(`${name} conectou`);
    users.push(name);
    refreshLista();
})

//Recebe o nome de um usuario que acabou de desconectar na sala de chat
socket.on('user-disconnected', name =>{
    appendMessage(`${name} desconectou`); 
    var indice = users.indexOf(name)
    users.splice(indice,1);
    refreshLista();
})

//Função trata evento e envia a mensagem que esta na caixa de texto para o servidor
messageForm.addEventListener('submit', e =>{
    e.preventDefault();
    const message = messageInput.value;
    socket.emit('send-chat-message', message);
    messageInput.value = '';
    appendMessage(`Você: ${message}`);
})

//atualiza lista de usuarios onlines
function refreshLista(){
    var i;
    text=""
    for(i=0;i<users.length;i++){
        text = text + users[i] + "<br>";
    }
    usuariosOnline.innerHTML = text;
}

//esta funcao imprime uma mensagem na area de conversação
function appendMessage(message){
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageContainer.append(messageElement);
    
}

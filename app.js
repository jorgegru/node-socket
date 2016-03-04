var app = require('http').createServer(index)
  , io = require('socket.io').listen(app)
  , fs = require('fs')
;
app.listen(80, function() {
  console.log("Servidor rodando!");
});

function index(req, res){
  fs.readFile(__dirname + '/index.html', function(err, data){
	  res.writeHead(200);
    res.end(data);
  });
};

// Iniciando Socket.IO

// var visitas = 0;
// Evento connection ocorre quando entra um novo usuário.

io.on('connection', function(socket){
	socket.on('join', function (data) {
		socket.join(data.email); // We are using room of socket io
		console.log(data.email);
	});
  
  
  setInterval(function(){ 
	socket.emit('toClientData', Date());

  }, 1000);
  
  
  
  socket.on('toServer', function(msg){
  
		// Atualiza o total de visitas para os demais usuários.
		io.sockets.in(msg.email).emit('toClient', msg.msg);
		console.log(msg.email);
		// socket.emit('toClient', msg);
		// socket.broadcast.emit('toClient', msg);
  });
  
  // // Envia o total de visitas para os demais usuários.

  // // socket.broadcast.emit('visits', visitas);

  // // Evento disconnect ocorre quando sai um usuário.

  // socket.on('disconnect', function(){
    // visitas--;
    // // Atualiza o total de visitas para os demais usuários.

    // socket.broadcast.emit('message', visitas);
  // });
});
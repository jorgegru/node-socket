// var app = require('http').createServer(index)
  // , io = require('socket.io').listen(app)
  // , fs = require('fs')
// ;

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);



	// function index(req, res){
	  // fs.readFile(__dirname + '/index.html', function(err, data){
		  // res.writeHead(200);
		// res.end(data);
	  // });
	// };

	app.get('/', function(req, res){
	  res.sendFile(__dirname + '/index.html');
	});

// Iniciando Socket.IO

// var visitas = 0;
// Evento connection ocorre quando entra um novo usuário.

	var clients = [];


	io.on('connection', function(socket){
		//console.log(socket);
		
		clients.push({"socket": socket.id, "nome": ''});
		
		for (i = 0; i < clients.length; i++) { 
			if(clients[i].socket==socket.id && clients[i].nome==''){
				socket.emit('toLogin', 'Insetir');
			}
		}
		
		

		socket.on('join', function (data) {
			for (i = 0; i < clients.length; i++) { 
				if(clients[i].socket==socket.id){
					clients[i].nome = data.email;
					
				}
			}

			// socket.join(data.email); // Sala
			// console.log(data.email);
			//console.log('User joined chat room 1');

			// var roster = io.sockets.adapter.rooms;
			// console.log(roster);
			socket.emit('toList', clients);
			socket.broadcast.emit('toList', clients);
		});
	  
	  
		setInterval(function(){ 
		socket.emit('toClientData', Date());
		

		}, 1000);

	  
	  
		socket.on('toServer', function(msg){

			// Atualiza o total de visitas para os demais usuários.
			io.sockets.in(msg.id_usuario).emit('toClient', {msg:msg.msg, id_usuario:msg.id_usuario});
			console.log(msg.id_usuario + ":"+msg.msg);
			// socket.emit('toClient', msg);
			// socket.broadcast.emit('toClient', msg);
		});
		
		
		socket.on('disconnect', function(){

			for (i = 0; i < clients.length; i++) { 
				if(clients[i].socket==socket.id){
					clients.splice(i, 1);
				}
			}
			console.log('user disconnected: '+ socket.id);
			socket.broadcast.emit('toList', clients);
		});
	  
	});

	http.listen(3000, function() {
	  console.log("Servidor rodando!");
	});
	
	
	
	
	// listarUsuario(){
		// for (i = 0; i < clients.length; i++) { 
				// if(clients[i].socket==socket.id){
					// clients[i].nome = data.email;
					
				// }
			// }
	// }
	
	

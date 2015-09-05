//Sockets
module.exports = function(io) {
	var crypto = require('crypto')
	, sockets = io.sockets
	, onlines = {};
	sockets.on('connection', function(client) {
		var session = client.handshake.session;
		var usuario = session.usuario;
		console.log(usuario.email + " entrou no chat!");
		onlines[usuario.email] = usuario.email;
		for (var email in onlines) {
			client.emit('notify-onlines', email);
			client.broadcast.emit('notify-onlines', email);
		}
		client.on('send-server', function(msg) {
			console.log(usuario.email + " enviou uma mensagem!");
			var sala = session.sala,
			data = {email: usuario.email, sala: sala};
			msg = "<b>" + usuario.nome + ":</b> " + msg + "<br>";
			client.broadcast.emit('new-message', data);
			sockets.in(sala).emit('send-client', msg);
		});
		client.on('join', function(sala) {
			if(!sala) {
				var timestamp = new Date().toString()
				, md5 = crypto.createHash('md5');
				sala = md5.update(timestamp).digest('hex');
			}
		session.sala = sala;
		client.join(sala);
		});
		client.on('disconnect', function () {
			console.log(usuario.email + " saiu do chat!");
			var sala = session.sala
			, msg = "<b>"+ usuario.nome +":</b> saiu.<br>";
			client.broadcast.emit('notify-offlines', usuario.email);
			sockets.in(sala).emit('send-client', msg);
			delete onlines[usuario.email];
			client.leave(session.sala);
		});
	});
}
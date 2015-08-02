var express = require('express');
var load = require('express-load');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var methodOverride = require('method-override');
var error = require('./middlewares/error');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(cookieParser('ntalk'));
app.use(expressSession({
	saveUninitialized: false,
	resave: false,
	secret: 'ntalk'
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(express.static(__dirname + '/public'));

load('models').then('controllers').then('routes').into(app);

io.sockets.on('connection', function(client) {
	client.on('send-server', function(data) {
		console.log("Enviando mensagem no chat!");
		var msg = "<b>" + data.nome + ":</b> " + data.msg + "<br>";
		client.emit('send-client', msg);
		client.broadcast.emit('send-client', msg);
	});
});

app.use(error.notFound);
app.use(error.serverError);

server.listen(80, function() {
	console.log('ntalk no ar!');
});
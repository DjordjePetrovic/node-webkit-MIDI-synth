(function startServer(){
/**
 * Module dependencies.
 */

var express = require('express');
// var routes = require('./routes');
// var user = require('./routes/user');
var http = require('http');
var path = require('path');
var midi = require("midi");

var app = express();

// all environments
app.set('port', process.env.PORT || 3500);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.engine('html', require('ejs').renderFile);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var server = http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});

var io = require('socket.io').listen(server);

var input = new midi.input();

console.log(input.getPortCount());
console.log(input.getPortName(0));

var controls = {
	16 : {
		'type': 'play_stop',
		'selector': '.stop'
	},
	17 : {
		'type': 'play_stop',
		'selector': '.play'
	},
	18 : {
		'type': 'play_stop',
		'selector': '.pause'
	},
	36 : {
		'type': 'drum_pads',
		'id' : '#box_sound_clap',
		'pad' : '.col_2'
	},
	37: {
		'type': 'drum_pads',
		'id' : '#box_sound_clap',
		'pad' : '.col_4'
	},
	38: {
		'type': 'drum_pads',
		'id' : '#box_sound_cow_bell',
		'pad' : '.col_4'
	},
	39: {
		'type': 'drum_pads',
		'id' : '#box_sound_cow_bell',
		'pad' : '.col_7'
	},
	40 : {
		'type': 'drum_pads',
		'id' : '#box_sound_bass_hit',
		'pad' : '.col_0'
	},
	41 : {
		'type': 'drum_pads',
		'id' : '#box_sound_bass_hit',
		'pad' : '.col_2'
	},
	42 : {
		'type': 'drum_pads',
		'id' : '#box_sound_bass_hit',
		'pad' : '.col_3'
	},
	43 : {
		'type': 'drum_pads',
		'id' : '#box_sound_bass_hit',
		'pad' : '.col_6'
	},
	48 : {
		'type': 'keys',
		'data-note' : 'C'
	},
	49 : {
		'type': 'keys',
		'data-note' : 'C#'
	},
	50 : {
		'type': 'keys',
		'data-note' : 'D'
	},
	51 : {
		'type': 'keys',
		'data-note' : 'D#'
	},
	52 : {
		'type': 'keys',
		'data-note' : 'E'
	},
	53 : {
		'type': 'keys',
		'data-note' : 'F'
	},
	54 : {
		'type': 'keys',
		'data-note' : 'F#'
	},
	55 : {
		'type': 'keys',
		'data-note' : 'G'
	},
	56 : {
		'type': 'keys',
		'data-note' : 'G#'
	},
	57 : {
		'type': 'keys',
		'data-note' : 'A'
	},
	58 : {
		'type': 'keys',
		'data-note' : 'A#'
	},
	59 : {
		'type': 'keys',
		'data-note' : 'B'
	}
}
io.sockets.on('connection', function (socket) {
  io.sockets.emit('keyboardModel',input.getPortName(0));
});

input.on('message', function(deltaTime, message) {
  if(message[2] == 0 && message[1] != 21 && message[1] != 22 && message[1] != 20 && message[1] != 19) {
  	dataToSend = controls[message[1]];
	io.sockets.emit('drumUpdates',dataToSend);
  }
  if(message[2] != 0 && message[1] >= 48 && message[1] <= 59) {
  	dataToSend = controls[message[1]];
	io.sockets.emit('keysUpdate',dataToSend);
  } 
  if(message[1] == 1) {
  	dataToSend = message[2];
	io.sockets.emit('bpmUpdate',dataToSend);
  }
  if(message[1] == 4) {
  	dataToSend = message[2];
	io.sockets.emit('lfoRateUpdate',dataToSend);
  }
  if(message[1] == 5) {
  	dataToSend = message[2];
	io.sockets.emit('envRelease',dataToSend);
  }
  if(message[1] == 2) {
  	dataToSend = message[2];
	io.sockets.emit('lfoUpdate',dataToSend);
  }
  if(message[1] == 3) {
  	dataToSend = message[2];
	io.sockets.emit('cutOffUpdate',dataToSend);
  }
  if(message[1] == 20 && message[2] == 0) {
  	io.sockets.emit('osc_shape_down');
  }
  if(message[1] == 19 && message[2] == 0) {
  	io.sockets.emit('osc_shape_up');
  }
  if(message[1] == 22 && message[2] == 0) {
  	io.sockets.emit('shape_down');
  }
  if(message[1] == 21 && message[2] == 0) {
  	io.sockets.emit('shape_up');
  }
});

input.openPort(0);

app.get('/', function (req, res)
{
    res.render('index.html');
});
})();

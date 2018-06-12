'use strict'

var express = require('express.io');
var	app = express();
var	port = process.env.PORT || 5000;

app.http().io();

app.set('views', __dirname + '/public');
app.use(express.static(__dirname+'/public'));

app.get('/', (req, res) => {
 		res.render('index.ejs');
});



app.io.route('ready', function(req) {
	req.io.join(req.data.chat_room);
	req.io.join(req.data.signal_room);
	req.io.join(req.data.files_room);
	app.io.room(req.data).broadcast('announce', {
		message: 'New client in the ' + req.data + ' room.'
	})
})

app.io.route('send', function(req) {
    app.io.room(req.data.room).broadcast('message', {
        message: req.data.message,
		author: req.data.author
    });
})

app.io.route('signal', function(req) {
	//Note the use of req here for broadcasting so only the sender doesn't receive their own messages
	req.io.room(req.data.room).broadcast('signaling_message', {
        type: req.data.type,
		message: req.data.message
    });
})

app.io.route('files', function(req) {
	req.io.room(req.data.room).broadcast('files', {
		filename: req.data.filename,
		filesize: req.data.filesize
	});
})






app.listen(port, () => {
	console.log('%d porta bağlandı',port) ;
})

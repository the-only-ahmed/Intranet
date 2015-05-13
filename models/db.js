var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
	login: String,
	password: {type: String, select: false},
	group: String,
	image: String,
	fname: String,
	name: String,
	id_p: 0
});

var ticketSchema = new mongoose.Schema({
	title: String,
	content: String,
	author: String,
	date: Date,
	status: String,
	id_p : 0
});

var ticketanswerSchema = new mongoose.Schema({
	id_ticket: String,
	content: String,
	author: String,
	date: Date,
	id_p : 0
});

var forumcategSchema = new mongoose.Schema({
	name: String,
	id_p : 0
});

var forumthreadSchema = new mongoose.Schema({
	title: String,
	content: String,
	author: String,
	date: Date,
	id_categ: String,
	id_p : 0
});

var forumanswerthreadSchema = new mongoose.Schema({
	id_thread: String,
	content: String,
	author: String,
	date: Date,
	id_p : 0
});

var forumcommentanswerSchema = new mongoose.Schema({
	id_answer: String,
	content: String,
	author: String,
	date: Date,
	id_p : 0
});

var connectlinkSchema = new mongoose.Schema({
	login: String,
	group: String,
	token: String,
	id_p : 0
});

var moduleSchema = new mongoose.Schema({
	name: String,
	content: String,
	place: Number,
	start_subscribe: Date,
	end_subscribe: Date,
	start_module: Date,
	end_module: Date,
	credit: Number,
	id_p : 0
});

var module_userSchema = new mongoose.Schema({
	id_user: String,
	id_module: String,
})

var activiteSchema = new mongoose.Schema({
	name: String,
	content: String,
	place: Number,
	start_subscribe: Date,
	end_subscribe: Date,
	start_activite: Date,
	end_activite: Date,
	group_min: Number,
	group_max: Number,
	peercorrecting: Number,
	group_auto: String,
	id_module: String,
	type: String,
	credit: Number,
	id_p : 0
});

var activite_userSchema = new mongoose.Schema({
	id_user: String,
	id_activite: String,
})

mongoose.model('User', userSchema);
mongoose.model('Ticket', ticketSchema);
mongoose.model('Ticketanswer', ticketanswerSchema);
mongoose.model('Categ', forumcategSchema);
mongoose.model('Thread', forumthreadSchema);
mongoose.model('Threadanswer', forumanswerthreadSchema);
mongoose.model('Answercomment', forumcommentanswerSchema);
mongoose.model('Connectlink', connectlinkSchema);
mongoose.model('Module', moduleSchema);
mongoose.model('Module_user', module_userSchema);
mongoose.model('Activite', activiteSchema);
mongoose.model('Activite_user', activite_userSchema);

//Connection DB
mongoose.connect('mongodb://localhost/intra42');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback ()
{
	console.log('Connection to database: DONE');
});

exports.show_all = function(req, res)
{
	var User = mongoose.model('User');
	User.find({}, {login: 1, group: 1}, function (err, users) {
		console.log("In fonction (db:show_all)");
		if(err)
			console.log("Get user list:" + err);
		else
			res.render('layout.ejs', {'page': 'db_show_users', 'user_list': users, 'user': req.usercookie.user, 'group': req.usercookie.group});
	})
}


var mongoose = require('mongoose');
var forum_method = require('../models/forum');
var Categ = mongoose.model('Categ');
var Thread = mongoose.model('Thread');
var Threadanswer = mongoose.model('Threadanswer');
var Answercomment = mongoose.model('Answercomment');

exports.forum = function(req, res)
{
	if (req.usercookie.user != undefined)
	{
		Categ.find({}, {}, function (err, categs) {
			if (err)
				console.log("Get Categ list:" + err);
			else
				res.render('layout.ejs', {'page': 'forum', "user": req.usercookie.user, "group": req.usercookie.group, 'categs': categs});
		});
	}
	else
		res.send(401, 'You\'re not allowed to see this page');
}

exports.delete_thread = function(req, res)
{
	if (req.usercookie.user != undefined)
		forum_method.delete_thread(res, req.query['id']);
	else
		res.send(401, 'You\'re not allowed to see this page');
}

exports.show_treads = function(req, res)
{
	if (req.usercookie.user != undefined)
	{
		Categ.findOne({name: req.query['name']}, function (err, categ) {
			if (err)
				console.log("Get Categ" + err);
			else
			{
				Thread.find({id_categ: categ._id}, {}, function (err, threads) {
					if (err)
						console.log("ERROR Get threads with categ" + err);
					else
						res.render('layout.ejs', {'page': 'forum_show_threads', "user": req.usercookie.user, "group": req.usercookie.group, 'threads': threads, 'id_categ': categ._id});
				});
			}
		});
	}
	else
		res.send(401, 'You\'re not allowed to see this page');
}

exports.add_thread = function(req, res)
{
	if (req.usercookie.user != undefined)
	{
		if (req.method == 'POST')
			forum_method.add_thread(req, res);
		else
			res.render('layout.ejs', {'page': 'forum_add_thread', "user": req.usercookie.user, "group": req.usercookie.group});
	}
	else
		res.send(401, 'You\'re not allowed to see this page');
}

exports.show_tread = function(req, res)
{
	var tab_comment = [];
	if (req.usercookie.user != undefined)
	{
		if (req.method == 'POST')
			forum_method.add_comment(req, res);
		else
		{
			Thread.findOne({_id: req.query['id']}, function (err, thread) {
				if (err)
					console.log("Get Categ" + err);
				else
				{
					Threadanswer.find({id_thread: req.query['id']}, {}, function (err, answers) {
						if (err)
							console.log("ERROR Get thread with answers: " + err);
						else
						{
							answers.forEach(function(answers)
							{
								
								Answercomment.find({id_answer: answers._id}, {}, function(err, comments){
									if (err)
										console.log("ERROR get comment with answers: " + err);
									else if (comments)
									{
										answers["comments"] = comments;
										console.log(answers["comments"]);
										//console.log("com: " + comment);
										//tab_comment.push(comment);
										//console.log("tab_comment: " + tab_comment);
										//console.log("END ARRAY");
									}
								});
								console.log('in foreach...');
							});
							console.log('end foreach...');
							res.render('layout.ejs', {'page': 'forum_show_thread', "user": req.usercookie.user, "group": req.usercookie.group, 'thread': thread, 'answers': answers});
							setTimeout(console.log('ok bb'), 10000000000000);
						}
					});
				}
			});
		}
	}
	else
		res.send(401, 'You\'re not allowed to see this page');
}

exports.add_answer = function(req, res)
{
	if (req.usercookie.user != undefined)
	{
		if (req.method == 'POST')
			forum_method.add_answer(req, res);
		else
			res.render('layout.ejs', {'page': 'forum_add_answer', "user": req.usercookie.user, "group": req.usercookie.group, 'id_thread': req.query['id']});
	}
	else
		res.send(401, 'You\'re not allowed to see this page');
}
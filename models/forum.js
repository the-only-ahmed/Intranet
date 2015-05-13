var mongoose = require('mongoose');
var Thread = mongoose.model('Thread');
var Categ = mongoose.model('Categ');
var Threadanswer = mongoose.model('Threadanswer');
var Answercomment = mongoose.model('Answercomment');

exports.add_thread = function(req, res)
{
	if (req.usercookie.user != undefined)
	{
		var thread_to_insert = new Thread
		({
			title: req.body.post.title,
			content: req.body.post.content,
			author: req.usercookie.user,
			date: new Date(),
			id_categ: req.query['id_categ'],
		});
		console.log(thread_to_insert);
		thread_to_insert.save(
			function (err)
			{
				if (err)
					console.error(err);
				else
					console.log('Add Thread: Good');
			});
	}
	res.redirect('/forum');
}

exports.delete_answer = function (thread)
{
	console.log("In fonction (Forum_model:delete_answer_in_thread)");
	Threadanswer.find({id_thread: thread}, function (err, allanswers)
	{
		allanswers.forEach(function(answer){
			Threadanswer.remove(function(err, product)
			{
				if (err)
					console.log('Error while deleting answer Thread '+ err);
				else
					console.log('Delete thread answer : GOOD');
			});
		});
	});
}

exports.delete_thread = function(res, thread)
{
	console.log("In fonction (Forum_modele:delete_thread)");
	this.delete_answer(thread);
	Thread.findOne({_id: thread}, function (err, mythread)
	{
		mythread.remove(function(err, product)
		{
			if (err)
				console.log('Error while deleting answer Thread '+ err);
			else
				console.log('Delete Thread: GOOD');
		});
		res.redirect('forum');
	});
}

exports.add_answer = function(req, res)
{
	if (req.usercookie.user != undefined)
	{
		var answer_to_insert = new Threadanswer
		({
			id_thread: req.query['id'],
			content: req.body.post.content,
			author: req.usercookie.user,
			date: new Date(),
		});
		console.log(answer_to_insert);
		answer_to_insert.save(
			function (err)
			{
				if (err)
					console.error(err);
				else
					console.log('anser: DONE');
			});
	}
	res.redirect('/forum');
}

exports.add_comment = function(req, res)
{
	console.log(req.body.post)
	if (req.usercookie.user != undefined)
	{
		var comment_to_insert = new Answercomment
		({
			id_answer: req.body.post.id_answer,
			content: req.body.post.comment,
			author: req.usercookie.user,
			date: new Date(),
		});
		console.log(comment_to_insert);
		comment_to_insert.save(
			function (err)
			{
				if (err)
					console.error(err);
				else
					console.log('answer: DONE');
			});
	}
	res.redirect('/forum');
}
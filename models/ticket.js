var mongoose = require('mongoose');
var Ticket = mongoose.model('Ticket');
var answer = mongoose.model('Ticketanswer');

exports.add_ticket = function(req, res)
{
	if (req.usercookie.user != undefined)
	{
		var post_to_insert = new Ticket
		({
			title: req.body.post.title,
			content: req.body.post.content,
			author: req.usercookie.user,
			date: new Date(),
			status: 'open',
		});
		console.log(post_to_insert);
		post_to_insert.save(
			function (err)
			{
				if (err)
					console.error(err);
				else
					console.log('ticket: DONE');
			});
	}
	res.redirect('/ticket_show');
}

exports.add_answer = function(req, res)
{
	if (req.usercookie.user != undefined)
	{
		var answer_to_insert = new answer
		({
			id_ticket: req.query['id'],
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
					console.log('answer: DONE');
			});
	}
	if (req.usercookie.group == 'admin')
		res.redirect('/admin_ticket_show');
	else
		res.redirect('/ticket_show');
}

exports.close = function(req, res)
{
	Ticket.findOne({_id: req.query['id']}, function (err, myticket) {
		if (myticket && (myticket.author == req.usercookie.user || req.usercookie.group == 'admin'))
		{
			myticket.status = 'close';
			myticket.save(function (error){
				if (error)
					console.error(err);
				else
					console.log('Ticket: Close');
			})
		}
	});
}

exports.open = function(req, res)
{
	Ticket.findOne({_id: req.query['id']}, function (err, myticket) {
		if (myticket && (myticket.author == req.usercookie.user || req.usercookie.group == 'admin'))
		{
			myticket.status = 'open';
			myticket.save(function (error){
				if (error)
					console.error(err);
				else
					console.log('Ticket: Open');
			})
		}
	});
}

exports.delete_answer = function (ticket)
{
	console.log("In fonction (User_model:delete_module)");
	answer.find({id_ticket: ticket}, function (err, allanswer)
	{
		allanswer.forEach(function(answer){
			answer.remove(function(err, product)
			{
				if (err)
					console.log('Error while deleting answer ticket '+ err);
				else
					console.log('Delete ticket answer: GOOD');
			});
		});
	});
}

exports.delete_ticket = function (res, ticket)
{
	console.log("In fonction (User_model:delete_ticket)");
	Ticket.findOne({_id: ticket}, function (err, myticket)
	{
		myticket.remove(function(err, product)
		{
			if (err)
				console.log('Error while deleting answer ticket '+ err);
			else
				console.log('Delete ticket: GOOD');
		});
		res.redirect('ticket_show');
	});
}
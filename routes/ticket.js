var ticket_method = require('../models/ticket');
var mongoose = require('mongoose');
var Ticket = mongoose.model('Ticket');
var Ticketanswer = mongoose.model('Ticketanswer');

exports.ticket = function(req, res)
{
	if (req.usercookie.user != undefined)
		res.render('layout.ejs', {'page': 'ticket', 'user': req.usercookie.user, 'group': req.usercookie.group});
	else
		res.send(401, 'You\'re not allowed to see this page');
}
exports.ticket_post = function(req, res)
{
	if (req.usercookie.user != undefined)
		ticket_method.add_ticket(req, res);
	else
		res.send(401, 'You\'re not allowed to see this page');
}

exports.ticket_delete = function(req, res)
{
	console.log("In fonction (ticket:delete)");
	if (req.usercookie.user != undefined)
	{
		Ticketanswer.find({ id_ticket: req.query['id'] }, function (err, allanswer) {
			if (err)
				console.log ('Error LDAP for show_profile' + err);
			else
			{
				ticket_method.delete_answer(req.query['id']);
				ticket_method.delete_ticket(res, req.query['id']);
			}
		});		
	}
	else
		res.send(401, 'You\'re not allowed to see this page');
}

exports.ticket_show = function(req, res)
{
	var Ticket = mongoose.model('Ticket');
	Ticket.find({author: req.usercookie.user}, {}, function (err, tickets) {
		console.log("In fonction (ticket:ticket_show)");
		if(err)
			console.log("Get ticket list:" + err);
		else
			res.render('layout.ejs', {'page': 'ticket_show', "user": req.usercookie.user, "group": req.usercookie.group, 'ticket_list': tickets});
	})
}

exports.ticket_show_id = function(req, res)
{
	console.log("In fonction (ticket:ticket_show_id)");
	Ticket.findOne({_id: req.query['id'], author: req.usercookie.user}, function (err, myticket) {
		if(err)
			console.log("Get ticket: "+ req.query['id'] +" Error:"+ err);
		else
		{
			Ticketanswer.find({id_ticket: req.query['id']}, {}, function (err, answers) {
				if(err)
					console.log("Get answer this ticket: "+ req.query['id'] +" Error:"+ err);
				else
					res.render('layout.ejs', {'page': 'ticket_show_id', "user": req.usercookie.user, "group": req.usercookie.group, 'ticket': myticket, 'answers': answers});
			})
		}
	})
}

exports.ticket_add_answer = function(req, res)
{
	console.log("In fonction (ticket:ticket_add_answer)");
	if (req.method == 'GET')
	{
		if (req.usercookie.user != undefined)
			res.render('layout.ejs', {'page': 'ticket_add_answer', 'user': req.usercookie.user, 'group': req.usercookie.group, 'id_ticket': req.query['id']});
		else
			res.send(401, 'You\'re not allowed to see this page');
	}
	else if (req.method == 'POST')
		ticket_method.add_answer(req, res);
	else
		res.send(401, 'You\'re not allowed to see this page');
}

exports.ticket_close = function(req, res)
{
	console.log("In fonction (ticket:ticket_close)");
	if (req.method == 'GET')
	{
		if (req.usercookie.user != undefined)
		{
			ticket_method.close(req, res);
			if (req.usercookie.group == 'admin')
				res.redirect('/admin_ticket_show');
			else
				res.redirect('/ticket_show');
		}
		else
			res.send(401, 'You\'re not allowed to see this page');
	}
	else
		res.send(401, 'Problem with this page...');
}

exports.ticket_open = function(req, res)
{
	console.log("In fonction (ticket:ticket_close)");
	if (req.method == 'GET')
	{
		if (req.usercookie.user != undefined)
		{
			ticket_method.open(req, res);
			if (req.usercookie.group == 'admin')
				res.redirect('/admin_ticket_show');
			else
				res.redirect('/ticket_show');
		}
		else
			res.send(401, 'You\'re not allowed to see this page');
	}
	else
		res.send(401, 'Problem with this page...');
}

var mongoose = require('mongoose');
var User = mongoose.model('User');
var Ticket = mongoose.model('Ticket');
var admin_method = require('../models/admin');
var user_method = require('../models/user');
var forum_method = require('../models/forum');
var Ticketanswer = mongoose.model('Ticketanswer');
var ticket_method = require('../models/ticket');
var Categ = mongoose.model('Categ');
var Module = mongoose.model('Module');
var Activite = mongoose.model('Activite');
var Thread = mongoose.model('Thread');

//---------------------------------------------- MODULES -------------------------------------------------
exports.module = function(req, res)
{
	if (req.usercookie.group == 'admin')
	{
		Module.find({}, {}, function (err, modules) {
			if(err)
				console.log("Get Modules" + err);
			else
			{
				if (req.method == "POST" && req.body.new_modules)
					admin_method.add_module(req, res);
				else if (req.method == "POST" && req.body.delete)
					admin_method.delete_module(req, res);
				else if (req.method == "POST" && req.body.update)
					admin_method.update_module(req, res);
				else
					res.render('layout.ejs', {'page': 'admin_modules', "user": req.usercookie.user, "group": req.usercookie.group, 'modules': modules});
			}
		});
	}
	else
		res.send(401, 'You\'re not allowed to see this page');
}
//---------------------------------------------- ACTIVITE -------------------------------------------------
exports.activite_show = function(req, res)
{
	if (req.usercookie.group == 'admin')
	{
		if (req.method == "POST")
			admin_method.delete_activite(req, res);
		else
		{
			Activite.find({id_module: req.query['id']}, {}, function (err, activites) {
				if(err)
					console.log("Error Get Activite: " + err);
				else
					res.render('layout.ejs', {'page': 'admin_activite_show', "user": req.usercookie.user, "group": req.usercookie.group, 'activites': activites, 'id_module': req.query['id']});
			});
		}
	}
	else
		res.send(401, 'You\'re not allowed to see this page');
}

exports.activite_add = function(req, res)
{
	if (req.usercookie.group == 'admin')
		if (req.method == "POST")
			admin_method.add_activite(req, res);
		else
			res.render('layout.ejs', {'page': 'admin_activite_add', "user": req.usercookie.user, "group": req.usercookie.group, 'id_module': req.query['id']});
	else
		res.send(401, 'You\'re not allowed to see this page');
}

//---------------------------------------------- USER -------------------------------------------------
exports.user_change = function(req, res)
{
	User.find({}, {login: 1, password: 1, group: 1}, function(err, doc){
		if (err) console.log("Error changing data:" + err);
		else
		{
			if (req.body.new_user != undefined && req.body.new_user.create == 'Create')
			{
				user_method.add(req.body.new_user.login, req.body.new_user.passwd, req.body.new_user.group, req, res, '/admin');
				res.redirect('/admin');
			}
			doc.forEach(function(value){
				if (req.body[value.login] != undefined)
				{
					if (req.body[value.login].new_login != undefined)
						admin_method.modify_user(value, req.body[value.login].new_login, 0);
					else if (req.body[value.login].new_passwd != undefined)
						admin_method.modify_user(value, req.body[value.login].new_passwd, 1);
					else if (req.body[value.login].new_group != undefined)
						admin_method.modify_user(value, req.body[value.login].new_group, 2);
					else if (req.body[value.login] == 'Delete')
						admin_method.modify_user(value, undefined, 3);
					res.redirect('/admin');
				}
			});
		}
	});
}

exports.user_show = function(req, res)
{
	console.log("In fonction (admin:admin_user_show)");
	if (req.usercookie.group == 'admin')
		admin_method.userlist('admin', req, res);
	else
		res.send(401, 'You\'re not allowed to see this page');
}

//---------------------------------------------- TICKET -------------------------------------------------

exports.ticket_show = function(req, res)
{
	console.log("In fonction (admin:admin_ticket_show)");
	if (req.usercookie.group == 'admin')
	{
		Ticket.find({status: 'open'}, {}, function (err, tickets) {

			if(err)
				console.log("Get ticket list:" + err);
			else
				res.render('layout.ejs', {'page': 'admin_tickets', "user": req.usercookie.user, "group": req.usercookie.group, 'ticket_list': tickets});
		});
	}
	else
		res.send(401, 'You\'re not allowed to see this page');
}

exports.ticket_show_id = function(req, res)
{
	console.log("In fonction (ticket:ticket_show_id)");
	if (req.usercookie.group == 'admin')
	{
		Ticket.findOne({_id: req.query['id']}, function (err, myticket) {
			if(err)
				console.log("Get ticket: "+ req.query['id'] +" Error:"+ err);
			else
			{
				Ticketanswer.find({id_ticket: req.query['id']}, {}, function (err, answers) {
					if(err)
						console.log("Get answer this ticket: "+ req.query['id'] +" Error:"+ err);
					else
						res.render('layout.ejs', {'page': 'admin_tickets_show_id', "user": req.usercookie.user, "group": req.usercookie.group, 'ticket': myticket, 'answers': answers});
				})
			}
		})
	}
	else
		res.send(401, 'You\'re not allowed to see this page');
}

exports.ticket_add_answer = function(req, res)
{
	console.log("In fonction (admin:ticket_add_answer)");
	if (req.usercookie.group == 'admin')
	{
		if (req.method == 'GET')
		{
			if (req.usercookie.user != undefined)
				res.render('layout.ejs', {'page': 'admin_tickets_add_answer', 'user': req.usercookie.user, 'group': req.usercookie.group, 'id_ticket': req.query['id']});
			else
				res.send(401, 'You\'re not allowed to see this page');
		}
		else if (req.method == 'POST')
			ticket_method.add_answer(req, res);
		else
			res.send(401, 'You\'re not allowed to see this page');
	}
	else
		res.send(401, 'You\'re not allowed to see this page');
}

//---------------------------------------------- CATEGORY -------------------------------------------------

exports.categ = function(req, res)
{
	console.log("In fonction (admin:categ)");
	if (req.usercookie.group == "admin")
	{
		Categ.find({}, {}, function (err, categs) {
			if (err)
				console.log("Get Categ list:" + err);
			else
			{
				if (req.method == 'POST' && req.body.categ)
					admin_method.add_categ(req, res);
				else if (req.method == 'POST' && req.body.update_categ)
					admin_method.update_categ(req, res);
				else if (req.method == 'POST' && req.body.categ_id)
					admin_method.delete_categ(req, res);
				else
					res.render('layout.ejs', {'page': 'admin_categ', "user": req.usercookie.user, "group": req.usercookie.group, 'categs': categs});
			}
		});
	}
	else
		res.send(401, 'You\'re not allowed to see this page');
}

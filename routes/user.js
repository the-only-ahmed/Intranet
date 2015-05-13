var User = require('mongoose').model('User');
var	Connectlink = require('mongoose').model('Connectlink');
var Activite = require('mongoose').model('Activite');
var Activite_user = require('mongoose').model('Activite_user');
var Module = require('mongoose').model('Module');
var Module_user = require('mongoose').model('Module_user');

var	method_ldap = require('../models/ldap');
var	method_user = require('../models/user');

var	bcrypt = require('bcrypt');
var	ldap = require('LDAP');

var	myldap = new ldap({
		uri: 'ldaps://ldap.42.fr:636/',
		version: 3,
		starttls: false,
		connecttimeout: 1,
		reconnect: true
	});



exports.subscribe = function(req, res)
{
	if (!req.usercookie.user)
		res.render('layout.ejs', {'page': 'subscribe'});
	else
		res.redirect('/');
}

exports.login = function(req,res)
{
	if (!req.usercookie.user)
		res.render('layout.ejs', {'page': 'login'});
	else
		res.redirect('/');
}

exports.connectlink = function(req,res)
{
	console.log("In fonction (User:connectlink)");
	if (req.usercookie.user != undefined)
	{
		Connectlink.findOne({login: req.usercookie.user}, {}, function(err, result){
			if (err)
				console.log("Error get Connectlink: " + err);
			else if (result)
				res.render('layout.ejs', {'page': 'connectlink', 'user': req.usercookie.user, 'group': req.usercookie.group, 'token': result});
			else
				method_user.add_connectlink(req, res);
		});
	}
	else
		res.send(401, 'You\'re not allowed to see this page');
}

exports.create = function(req, res)
{
	User.findOne({login: req.body.user.login}, function(err, doc){
	{
		if (err)
			console.log("Error while checking login" + err);
		else if (doc == null)
		{
			method_user.add(req.body.user.login, req.body.user.passwd, 'member', req.body.user.fname, req.body.user.name, req, res);
			res.redirect("/login");
		}
		else
			res.render('layout.ejs', {'page': 'subscribe', 'error': 'exist'});
	}});
}

exports.logging = function(req, res)
{
	console.log("In fonction (User:logging)");
	User.findOne({login: req.body.user.login}, {login: 1, password: 1, group: 1}, function(err, doc){
		if (err)
			console.log("Error while checking login" + err);
		else if (doc == null)
			method_ldap.connect(req, res, req.body.user.login, req.body.user.passwd, 1);
		else
		{
			bcrypt.compare(req.body.user.passwd, doc.password, function(err, result){
				if (err)
				{
					console.log("Error while checking password: " + err);
					res.redirect('login');
				}
				else if (result)
				{
					req.usercookie.user = doc.login;
					req.usercookie.group = doc.group;
					if (doc.group == 'ldap')
						method_ldap.connect(req, res, req.body.user.login, req.body.user.passwd, 0);
					res.render('layout.ejs', {'page': 'home', 'user': req.usercookie.user, 'group': req.usercookie.group});
				}
				else
				{
					console.log("Bad password.");
					res.redirect('login');
				}
			});
		}
	});
}

exports.logging_link = function(req, res)
{
	console.log("In fonction (User:logging_link)");
	Connectlink.findOne({login: req.query['login'], group: req.query['group'], token: req.query['token']}, {login: 1, group: 1, token: 1}, function(err, doc){
		if (err)
			console.log("Error while checking login" + err);
		else if (doc == null)
			res.send(401, 'Sorry ! Bad Connectlink.');
		else
		{
			Connectlink.remove({token: req.query['token']}, function(err, doc) {
				if (err)
					console.log("Error while checking login" + err);
				else
					console.log("Delete link : good");
			});
			req.usercookie.user = doc.login;
			req.usercookie.group = doc.group;
				if (doc.group == 'ldap')
					method_ldap.connect(req, res, 'acollin', 'susu07', 0);
			res.redirect('/');
		}
	});
}

exports.show_all_elearn = function(req, res)
{
	if (req.usercookie.group != undefined)
	{
		Activite.find({}, {}, function(err, activites){
			if (err)
				console.log("Error get activites: " + err);
			else
				res.render('layout.ejs', {'page': 'elearn', 'activites': activites, 'user': req.usercookie.user, 'group': req.usercookie.group});
		});
	}
	else
		res.redirect('/');
}


exports.show_profile = function(req, res)
{
	if (req.usercookie.group != undefined && req.usercookie.group == "admin")
		res.redirect('/admin');
	if (req.usercookie.group != undefined && req.usercookie.group == "member")
	{
		User.findOne({login: req.usercookie.user}, function(err, user)
		{
			if (err)
				console.log("Error show profiles member: " + err);
			else
				res.render('layout.ejs', {'page': 'show_profile', 'users': user,'user': req.usercookie.user, 'group': req.usercookie.group});
		});
	}
	else if (req.usercookie.group != undefined && req.usercookie.group == 'ldap')
	{
		var bind_options =
		{
			binddn: 'uid=acollin,ou=2013,ou=people,dc=42,dc=fr',
			password: 'susu07'
		};
		myldap.open(function(err)
		{
			if (err)
				throw new Error('Can not connect');
			else
			{
				var search_options =
				{
					base: 'ou=people,dc=42,dc=fr',
					scope: 3,
					filter: '(uid=' + req.usercookie.user + ')',
					attrs: ''
				};
				myldap.search(search_options, function(err, data)
				{
					if (err)
						console.log ('Error LDAP for show_profile' + err);
					else
					{
						User.findOne({login: req.usercookie.user}, function(err, user)
						{
							if (err)
							console.log("Error show profiles member: " + err);
							else
							res.render('layout.ejs', {'page': 'show_profile', 'user_ldap': data, 'user_db': user, 'user': req.usercookie.user, 'group': req.usercookie.group});
						});
					}
				});
			}
		});
	}
}

exports.show_profile_id = function(req, res)
{
	User.findOne({_id: req.query['id']}, function(err, user){
		if (err)
			console.log ('show_profile' + err);
		else if (user.group == "member")
			res.render('layout.ejs', {'page': 'show_profile_id', 'users': user, 'user': req.usercookie.user, 'group': req.usercookie.group});
		else if (user.group == "ldap")
		{
			var bind_options =
			{
				binddn: 'uid=acollin,ou=2013,ou=people,dc=42,dc=fr',
				password: 'susu07'
			};
			myldap.open(function(err)
			{
				if (err)
					console.log ('LDAP not connect');
				else
				{
					var search_options =
					{
						base: 'ou=people,dc=42,dc=fr',
						scope: 3,
						filter: '(uid=' + user.login + ')',
						attrs: ''
					};
					myldap.search(search_options, function(err, data)
					{
						if (err)
							console.log ('Error LDAP for show_profile' + err);
						else
							res.render('layout.ejs', {'page': 'show_profile_id', 'user_ldap': data, 'users': user, 'user': req.usercookie.user, 'group': req.usercookie.group});
					});
				}
			});
		}
		else
			res.send(401, 'unknown User!');
	});
}

exports.show_profile_activite = function(req, res)
{
	if (req.usercookie.group != undefined)
	{
			Activite.find({id_module: req.query['id_module']}, {}, function (err, activites) {
				console.log(activites);
				if(err)
					console.log("Error Get Activite: " + err);
				else
				{
					Activite_user.find({id_user: req.usercookie.user}, {}, function (err, activites_user) {
						console.log('activ user : ' + activites_user);
						if(err)
							console.log("Error Get Activite: " + err);
						else
							res.render('layout.ejs', {'page': 'show_profile_activite', "user": req.usercookie.user, "group": req.usercookie.group, 'activites': activites, 'id_module': req.query['id']});
					});
				}
			});
	}
	else
		res.send(401, 'You\'re not allowed to see this page');
}
exports.add_module = function(req, res)
{
	if (req.usercookie.user != undefined)
	{
		Module_user.findOne({ id_module: req.query['id_module'] }, function (err, exist) {
			if (err)
				console.log ('Error LDAP for show_profile' + err);
			else
				method_user.add_module(req.query['id_module'], req.query['id_user']);
			res.redirect('show_profile_module?id='+ req.query['id_user']);
		});
	}
	else
		res.send(401, 'You\'re not allowed to see this page');
}

exports.delete_module = function(req, res)
{
	console.log("In fonction (User:delete_module)");
	if (req.usercookie.user != undefined)
	{
		Module_user.findOne({ id_module: req.query['id_module'] }, function (err, exist) {
			if (err)
				console.log ('Error LDAP for show_profile' + err);
			else
				method_user.delete_module(req.query['id_module'], req.query['id_user']);
			res.redirect('show_profile_module?id='+ req.query['id_user']);
		});
	}
	else
		res.send(401, 'You\'re not allowed to see this page');
}

exports.pwdchange = function(req, res)
{
	if (req.usercookie.user != undefined && req.usercookie.group != 'ldap')
		res.render('layout.ejs', {'page': 'pwdchange', 'user': req.usercookie.user, 'group': req.usercookie.group});
	else
		res.send(401, 'You\'re not allowed to see this page');
}

exports.change_pwd = function(req, res)
{
	if (req.usercookie.user != undefined && req.usercookie.group != 'ldap')
		method_user.change_pwd(req, res);
	else
		res.send(401, 'You\'re not allowed to see this page');
}

exports.disconnect = function(req, res)
{
	req.usercookie.reset();
	req.usercookie.user = undefined;
	req.usercookie.group = undefined;
	res.redirect('/');
}

exports.show_module = function(req, res)
{
	if (req.usercookie.user != undefined)
	{
		Module_user.find({ id_user: req.query['id'] },{id_module: 1}, function (err, modules_user) {
				if(err)
					console.log("Error Get Activite: " + err);
				else
				{
					Module.find({}, function (err, modules) {
						if (err)
							console.log("Error Get Activite: " + err);
						else if (modules_user.length == 0)
						{
							console.log("Putin se mere !!!");
							res.render('layout.ejs', {'page': 'show_profile_module', "user": req.usercookie.user, "group": req.usercookie.group, 'modules_user': modules_user, 'modules': modules, 'id': req.query['id']});
						}
						else
							res.render('layout.ejs', {'page': 'show_profile_module', "user": req.usercookie.user, "group": req.usercookie.group, 'modules_user': modules_user, 'modules': modules, 'id': req.query['id']});
					});
				}
			});
	}
	else
		res.send(401, 'You\'re not allowed to see this page');
}

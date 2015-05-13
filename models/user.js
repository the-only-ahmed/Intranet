var User = require('mongoose').model('User');
var	Connectlink = require('mongoose').model('Connectlink');
var Module = require('mongoose').model('Module');
var Module_user = require('mongoose').model('Module_user');

var	bcrypt = require('bcrypt');
var	ldap = require('LDAP');


exports.add = function(login, password, group, fname, name, req, res)
{
	console.log("In fonction (User:add)");
	bcrypt.genSalt(10, function(err, salt){
		bcrypt.hash(password, salt, function(err, password_crypt){
			if (err)
				console.log("Error encoding password");
			else
			{

			//Preparation de l'utilisateur
				var user_to_insert = new User
				({
					login: login,
					password: password_crypt,
					group: group,
					image: "./public/img/naruto.jpg",
					fname: fname,
					name: name,
					id_p: 0
				});
			//Envoi et sauvegarde de l'utilisateur danbs la DB
			user_to_insert.save(
				function (err)
				{
					if (err)
						console.error(err);
					else
					{
						console.log('Subscribe: DONE');
					}
				});
			}
		});
	});
}

exports.add_module = function(module, user)
{
	var new_mod = new Module_user
	({
		id_user: user,
		id_module: module,
		id_p: 0
	});
	new_mod.save(function (err)
	{
		if (err)
			console.error(err);
		else
			console.log('Module ADD');
	});
}

exports.delete_module = function(module, user)
{
	console.log("In fonction (User_model:delete_module)");
	Module_user.findOne({id_module: module, id_user: user}, function (err, mymodule)
	{
		if (err)
			console.error(err);
		else (mymodule.length > 0)
		{
			mymodule.remove(function(err, product){
				if (err)
					console.log('Error while deleting user '+ err);
				else
					console.log('Delete module: DONE');
			});
		}
	});
}


exports.change_pwd = function(req,res)
{
	console.log("In fonction (User:change_pwd)");
	User.findOne({login: req.usercookie.user}, {login: 1, password: 1}, function(err, doc){
		if (err)
			console.log("Error while searching login:" + err);
		else if (doc == null)
			console.log("Can't find identity");
		else
		{
			bcrypt.compare(req.body.user.old_pwd, doc.password, function(err, result){
				console.log('req body : ' + req.body.user.old_pwd);
				console.log('doc pass : ' + doc.password);
				if (result != true)
				{
					res.send(401, 'You entered a wrong password');
					console.log("Error wrong password: " + err);
				}
				else if (result == true)
				{
					bcrypt.genSalt(10, function(err, salt){
						bcrypt.hash(req.body.user.new_pwd, salt, function(err, hash){
							if (err)
								console.log("Error encoding passwd");
							else
							{
								console.log('Password changed');
								doc.password = hash;
								doc.save(function (err)
								{
									if (err)
										console.error(err);
									else
										console.log('Change password: DONE');
								});
								res.redirect('/');
							}
						});
					});
				}
				else
					res.render('layout.ejs', {'page': 'pwdchange', 'user': req.usercookie.user});
			});
		}
	});
}

exports.add_connectlink = function(req,res)
{
	console.log("In fonction (User:add_connectlink)");
	require('crypto').randomBytes(32, function(err, tok) {
		if (err)
		{
			console.log("Error: Generate Token");
			res.redirect('/');
		}
		else
		{
			var token = tok.toString('hex');
			var link_to_insert = new Connectlink
				({
					login: req.usercookie.user,
					group: req.usercookie.group,
					token: token,
					id_p: 0
				});
			link_to_insert.save(function (err) {
				if
					(err) console.error(err);
				else
				{
					console.log('Connectlink: Create');
					res.redirect('/connectlink');
				}
			});
		}
	});
}


var mongoose = require('mongoose');
var Categ = mongoose.model('Categ');
var Module = mongoose.model('Module');
var Activite = mongoose.model('Activite');


//---------------------------------------------- USER -------------------------------------------------

exports.userlist = function(page, req, res){
	var User = mongoose.model('User');
	User.find({}, {login: 1, group:1}, function (err, users) {
	if(err)
		console.log("Get user list:" + err);
	else
			res.render('layout.ejs', {'page': 'admin_users', 'user_list': users, 'user': req.usercookie.user, 'group': req.usercookie.group});
	}
)}


exports.modify_user = function(doc, new_data, type_data)
{
	if (type_data == 0)
		doc.login = new_data;
	else if (type_data == 2)
		doc.group = new_data;
	else if (type_data == 3)
	{
		doc.remove(function(err, product){
			if (err)
				console.log('Error while deleting user '+ err);
			else
				console.log('Delete user: DONE');
		});
	}
	else if (type_data == 1)
	{
		bcrypt.genSalt(10, function(err, salt){
			bcrypt.hash(new_data, salt, function(err, hash){
				if (err) console.log("Error encoding passwd");
				else
				{
					doc.password = hash;
					doc.save(function (err) {
						if (err) console.error(err);
						else console.log('HashPwd Change: DONE');
					});
				}
			});
		});
	}
	doc.save(function (err) {
			if (err) console.error(err);
			else console.log('Change: DONE');
		});
}

//---------------------------------------------- CATEGORY -------------------------------------------------

exports.add_categ = function (req, res)
{
	if (req.usercookie.group == 'admin')
	{
		var categ_to_insert = new Categ
		({
			name: req.body.categ,
		});
		console.log(categ_to_insert);
		categ_to_insert.save(
			function (err)
			{
				if (err)
					console.error(err);
				else
					console.log('ticket: DONE');
			});
		res.redirect('/admin_categ');
	}
}

exports.update_categ = function (req, res)
{
	Categ.findOne({_id: req.body.id_categ}, function (err, mycateg) {
		if (mycateg && req.usercookie.group == 'admin')
		{
			mycateg.name = req.body.update_categ;
			mycateg.save(function (error){
				if (error)
					console.error(err);
				else
					console.log('Update Categ');
				res.redirect('/admin_categ');
			})
		}
	});
}

exports.delete_categ = function (req, res)
{
	console.log("In fonction (admin:delete_categ)");
	if (req.usercookie.group == 'admin')
	{
		Categ.findOne({_id: req.body.categ_id}, function (err, mycateg)
		{
			if (err)
				console.error(err);
			else
			{
				mycateg.remove(function(err, product){
					if (err)
						console.log('Error while deleting categ '+ err);
					else
						console.log('Delete categ: DONE');
				});
			}
			res.redirect('/admin_categ');
		});
	}
}

//---------------------------------------------- MODULE-------------------------------------------------


exports.add_module = function (req, res)
{
	if (req.usercookie.group == 'admin')
	{
		var module_to_insert = new Module
		({
			name: req.body.new_modules.name,
			content: req.body.new_modules.content,
			place: req.body.new_modules.place,
			start_subscribe: req.body.new_modules.start_subscribe,
			end_subscribe: req.body.new_modules.end_subscribe,
			start_module: req.body.new_modules.start_module,
			end_module: req.body.new_modules.end_module,
			credit: req.body.new_modules.credit,
		});
		console.log(module_to_insert);
		module_to_insert.save(
			function (err)
			{
				if (err)
					console.error(err);
				else
					console.log('Module: DONE');
			});

		var categ_to_insert = new Categ
		({
			name: req.body.new_modules.name,
		});
		console.log(categ_to_insert);
		categ_to_insert.save(
			function (err)
			{
				if (err)
					console.error(err);
				else
					console.log('Categ: create');
			});
		res.redirect('/admin_module');
	}
}

exports.delete_module = function (req, res)
{
	console.log("In fonction (admin:delete_module)");
	if (req.usercookie.group == 'admin')
	{
		Module.findOne({_id: req.body.delete}, function (err, mymodule)
		{
			if (err)
				console.error(err);
			else (mymodule.length > 0)
			{
				mymodule.remove(function(err, product){
					if (err) console.log('Error while deleting user '+ err);
					else console.log('Delete module: DONE');
				});
			}
			res.redirect('/admin_module');
		});
	}
}

exports.update_module = function (req, res)
{
	console.log("In fonction (admin:update_module)");
	console.log(req.body.update);
	Module.findOne({_id: req.body.id}, function (err, mymodule) {
		if (mymodule && req.usercookie.group == 'admin')
		{
			if (req.body.update.name)
				mymodule.name = req.body.update.name;

			else if (req.body.update.content)
				mymodule.content = req.body.update.content;

			else if (req.body.update.place)
				mymodule.place = req.body.update.place;

			else if (req.body.update.start_subscribe)
				mymodule.start_subscribe = req.body.update.start_subscribe;

			else if (req.body.update.end_subscribe)
				mymodule.end_subscribe = req.body.update.end_subscribe;

			else if (req.body.update.start_module)
				mymodule.start_module = req.body.update.start_module;

			else if (req.body.update.end_module)
				mymodule.end_module = req.body.update.end_module;

			else if (req.body.update.credit)
				mymodule.credit = req.body.update.credit;

			mymodule.save(function (error){
				if (error)
					console.error(err);
				else
					console.log('Update modules');
				res.redirect('/admin_module');
			})
		}
		else
			console.error("ERROR update module " + err);
	});
}

//---------------------------------------------- ACTIVITE -------------------------------------------------
exports.add_activite = function (req, res)
{
	if (req.usercookie.group == 'admin')
	{
		var activite_to_insert = new Activite
		({
			name: req.body.name,
			content: req.body.content,
			place: req.body.place,
			start_subscribe: req.body.start_subscribe,
			end_subscribe: req.body.end_subscribe,
			start_activite: req.body.start_activite,
			end_activite: req.body.end_activite,
			group_max: req.body.group_max,
			group_min: req.body.group_min,
			peercorrecting: req.body.peercorrecting,
			group_auto: req.body.group_auto,
			id_module: req.body.id_module,
			type: req.body.type,
			credit: req.body.credit,
		});
		console.log(activite_to_insert);
		activite_to_insert.save(
			function (err)
			{
				if (err)
					console.error(err);
				else
					console.log('Module: DONE');
			});
		res.redirect('/admin_activite_show?id=' + req.body.id_module);
	}
}

exports.delete_activite = function (req, res)
{
	console.log("In fonction (admin:activite_module)");
	if (req.usercookie.group == 'admin')
	{
		Activite.findOne({_id: req.body.id_activite}, function (err, myactivite)
		{
			if (err)
				console.error(err);
			else
			{
				myactivite.remove(function(err, product){
					if (err) console.log('Error while deleting user '+ err);
					else console.log('Delete module: DONE');
				});
			}
			res.redirect('/admin_activite_show?id=' + req.body.id_module);
		});
	}
}

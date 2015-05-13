var	server = require('../server');

database = require('../models/db');

//---------------------------USER---------------------------
exports.user_login = require('./user.js').login;
exports.user_logging = require('./user.js').logging;
exports.user_subscribe = require('./user.js').subscribe;
exports.user_create = require('./user.js').create;
exports.user_disconnect = require('./user.js').disconnect;
exports.user_change_pwd = require('./user.js').change_pwd;
exports.user_pwdchange = require('./user.js').pwdchange;

exports.ldap_show_users = require('./ldap.js').show_users;
exports.db_show_users = require('./db.js').show_users;

exports.user_connectlink = require('./user.js').connectlink;
exports.user_logging_link = require('./user.js').logging_link;

exports.user_show_profile = require('./user.js').show_profile;
exports.user_show_profile_activite = require('./user.js').show_profile_activite;
exports.user_show_profile_id = require('./user.js').show_profile_id;
exports.user_show_module = require('./user.js').show_module;
exports.user_add_module = require('./user.js').add_module;
exports.user_delete_module = require('./user.js').delete_module;

exports.user_elearn = require('./user.js').show_all_elearn;

//---------------------------TICKET---------------------------
exports.ticket = require('./ticket.js').ticket;
exports.ticket_post = require('./ticket.js').ticket_post;
exports.ticket_show = require('./ticket.js').ticket_show;
exports.ticket_show_id = require('./ticket.js').ticket_show_id;
exports.ticket_add_answer = require('./ticket.js').ticket_add_answer;
exports.ticket_close = require('./ticket.js').ticket_close;
exports.ticket_open = require('./ticket.js').ticket_open;
exports.ticket_delete = require('./ticket.js').ticket_delete;

//---------------------------FORUM---------------------------
exports.forum = require('./forum.js').forum;
exports.forum_show_threads = require('./forum.js').show_treads;
exports.forum_show_thread = require('./forum.js').show_tread;
exports.forum_add_thread = require('./forum.js').add_thread;
exports.forum_thread_add_answer = require('./forum.js').add_answer;
exports.forum_answer_add_comment = require('./forum.js').add_comment;
exports.forum_delete_thread = require('./forum.js').delete_thread;

//---------------------------ADMIN---------------------------
exports.admin_user_show = require('./admin.js').user_show;
exports.admin_user_change = require('./admin.js').user_change;

exports.admin_ticket_show = require('./admin.js').ticket_show;
exports.admin_ticket_show_id = require('./admin.js').ticket_show_id;
exports.admin_ticket_add_answer = require('./admin.js').ticket_add_answer;

exports.admin_categ = require('./admin.js').categ;

exports.admin_module = require('./admin.js').module;

exports.admin_activite_show = require('./admin.js').activite_show;
exports.admin_activite_add = require('./admin.js').activite_add;

//Pas besoin de routes multiples ou special
exports.index = function(req, res)
{
	res.render('layout.ejs', {'page': 'home', 'user': req.usercookie.user, 'group': req.usercookie.group});
}

exports.admin = function(req, res)
{
	res.render('layout.ejs', {'page': 'admin_index', 'user': req.usercookie.user, 'group': req.usercookie.group});
}

exports.lang_fr = function(req,res)
{
	var i18n = server.i18n;
	i18n.setLng('fr', function(t) {
		res.redirect('/');
	});
}

exports.lang_en = function(req,res)
{
	var i18n = server.i18n;
	i18n.setLng('en', function(t) {
		res.redirect('/');
	});
}

exports.lang_ar = function(req,res)
{
	var i18n = server.i18n;
	i18n.setLng('ar', function(t) {
		res.redirect('/');
	});
}

exports.user_elearn_show = function(req, res)
{
	if (req.method == "POST")
	{
		console.log(req.files.pdf);
	}
	if (req.usercookie.user != undefined)
		res.render('layout.ejs', {'page': 'elearn_show', 'user': req.usercookie.user, 'group': req.usercookie.group, 'name': req.query['name']});

}

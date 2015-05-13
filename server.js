var http = require('http'),
	https = require('https'),
	fs = require('fs'),
	express = require('express'),
	favicon = require('static-favicon'),
	bodyParser = require('body-parser'),
	sessions = require('client-sessions'),
	ejs = require('ejs'),
	mongoose = require('mongoose'),
	app = express(),
	routes = require('./routes'),
	bcrypt = require('bcrypt'),
	ldap = require('LDAP');

//Server on
var server = http.createServer(app).listen(3000, function(){
	console.log("Express server listening on port 3000");
});

//traduction
var i18n = require('i18next');
i18n.init({
	load: 'current',
	saveMissing: true,
	cookieName: 'lang',
	resGetPath: 'locales/__lng__.json',
	detectLngFromPath: 0,
	detectLngFromHeaders: false,
	supportedLngs: ['en', 'fr', 'ar'],
	fallbackLng: 'en'
});


//Config
app.use('/public', express.static('public'));
app.use(favicon(__dirname + '/public/img/favicon.ico'));
app.use(bodyParser( { keepExtensions: true, uploadDir: '/public/pdf' } ));
app.use(sessions({
	cookieName: 'usercookie',
	secret: 'Jamdude599*=/Hih98&*@32454d0',
	duration: 24 * 60 * 60 * 1000
}));
i18n.registerAppHelper(app);
app.use(i18n.handle);

module.exports.app = app;
module.exports.i18n = i18n;

ejs.filters.t = function(key) {
	return i18n.t(key);
};

app.get('/', routes.index);

//LANG
app.get('/fr', routes.lang_fr);
app.get('/en', routes.lang_en);
app.get('/ar', routes.lang_ar);

//---------------------------USER---------------------------
app.get('/show_profile', routes.user_show_profile);
app.get('/show_profile_module', routes.user_show_module);
app.get('/show_profile_id', routes.user_show_profile_id);
app.get('/show_profile_activite', routes.user_show_profile_activite);

app.get('/add_module', routes.user_add_module);
app.get('/delete_module', routes.user_delete_module);

app.get('/ldap_show_users', routes.ldap_show_users);
app.get('/db_show_users', routes.db_show_users);

app.get('/login', routes.user_login);
app.post('/login', routes.user_logging);
app.get('/logging_link', routes.user_logging_link);

app.get('/disconnect', routes.user_disconnect);

app.get('/subscribe', routes.user_subscribe);
app.post('/subscribe', routes.user_create);
app.get('/pwdchange', routes.user_pwdchange);
app.post('/pwdchange', routes.user_change_pwd);
app.get('/connectlink', routes.user_connectlink);
app.get('/elearn', routes.user_elearn);
app.get('/elearn_show', routes.user_elearn_show);
app.post('/elearn_show', routes.user_elearn_show);

//---------------------------TICKET---------------------------
app.get('/ticket', routes.ticket);
app.post('/ticket', routes.ticket_post);
app.get('/ticket_show', routes.ticket_show);
app.get('/ticket_show_id', routes.ticket_show_id);
app.get('/ticket_add_answer', routes.ticket_add_answer);
app.post('/ticket_add_answer', routes.ticket_add_answer);
app.get('/ticket_close', routes.ticket_close);
app.get('/ticket_open', routes.ticket_open);
app.get('/ticket_delete', routes.ticket_delete);
//---------------------------FORUM---------------------------
app.get('/forum', routes.forum);
app.get('/forum_show_threads', routes.forum_show_threads);
app.get('/forum_show_thread', routes.forum_show_thread);
app.post('/forum_show_thread', routes.forum_show_thread);
app.get('/forum_add_thread', routes.forum_add_thread);
app.post('/forum_add_thread', routes.forum_add_thread);
app.get('/forum_thread_add_answer', routes.forum_thread_add_answer);
app.post('/forum_thread_add_answer', routes.forum_thread_add_answer);
app.get('/forum_delete_thread', routes.forum_delete_thread);

//---------------------------ADMIN---------------------------
app.get('/admin', routes.admin);

app.get('/admin_user_show', routes.admin_user_show);
app.post('/admin_user_show', routes.admin_user_change);

app.get('/admin_ticket_show', routes.admin_ticket_show);
app.get('/admin_ticket_show_id', routes.admin_ticket_show_id);

app.get('/admin_ticket_add_answer', routes.admin_ticket_add_answer);
app.post('/admin_ticket_add_answer', routes.admin_ticket_add_answer);

app.get('/admin_categ', routes.admin_categ);
app.post('/admin_categ', routes.admin_categ);

app.get('/admin_module', routes.admin_module);
app.post('/admin_module', routes.admin_module);

app.get('/admin_activite_show', routes.admin_activite_show);
app.post('/admin_activite_show', routes.admin_activite_show);

app.get('/admin_activite_add', routes.admin_activite_add);
app.post('/admin_activite_add', routes.admin_activite_add);

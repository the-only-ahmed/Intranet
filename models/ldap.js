var ldap = require('LDAP');
	method_user = require('./user');
var	myldap = new ldap({
		uri: 'ldaps://ldap.42.fr:636/',
		version: 3,
		starttls: false,
		connecttimeout: 1,
		reconnect: true
	});

exports.connect = function(req, res, uid, pwd, add)
{
	console.log("In fonction (Ldap:connect)");
	var bind_options = {
		binddn: 'uid='+uid+',ou=2013,ou=people,dc=42,dc=fr',
		password: pwd
	};
	myldap.open(function(err) {
		if (err)
			console.log('Cannot connect LDAP :' + err);
		else
		{
			console.log('LDAP Connection: Ok');
			myldap.simplebind(bind_options, function(err) {
				if (err)
				{
					console.log('Can\'t bind to LDAP: ' + err);
					res.render('layout.ejs', {'page': 'login'});
				}
				else
				{
					console.log('Bind to LDAP');
					if (req.usercookie.group != 'admin')
					{
						req.usercookie.user = uid;
						req.usercookie.group = 'ldap';
						console.log(req.usercookie);
						if (add == 1)
							method_user.add(req.body.user.login, req.body.user.passwd, 'ldap', req, res);
					}
					res.render('layout.ejs', {'page': 'home', 'user': req.usercookie.user, 'group': req.usercookie.group});
				}
			});
		}
	});
}

exports.show_all = function(req, res)
{
	console.log("In fonction (Ldap:show_all)");

	if (req.usercookie.group != 'ldap' && req.usercookie.group != 'admin')
		res.send(401, 'You\'re not allowed to see this page');
	else
	{
		var search_options = {
			base: 'ou=people,dc=42,dc=fr',
			scope: 3,
			filter: '',
			attrs: ''
		};
		myldap.search(search_options, function(err, data){
			if (err)
				console.log ('Error getting LDAP: ' + err);
			else
			{
				//data.sort(dynamicSort('uid'));
				var btoa = require('btoa');
				data.forEach(function(elem)
				{
					//Parse birth date
					if (elem['birth-date'] != undefined)
						elem['birth-date'][0] = elem['birth-date'][0].substring(0, 4)
							+ '/' + elem['birth-date'][0].substring(4, 6) + '/'
							+ elem['birth-date'][0].substring(6, 8);
				});
				res.render('layout.ejs', {'page': 'ldap_show_all', 'user': req.usercookie.user, 'group': req.usercookie.group, 'user_list': data});
			}
		});
	}
}


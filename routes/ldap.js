var method_ldap = require('../models/ldap');

exports.show_users = function(req,res)
{
	if (req.usercookie.user != undefined)
		method_ldap.show_all(req, res);
	else
		res.send(401, 'You\'re not allowed to see this page');
}
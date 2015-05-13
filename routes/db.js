var method_db = require('../models/db');

exports.show_users = function(req,res)
{
	if (req.usercookie.user != undefined)
		method_db.show_all(req, res);
	else
		res.send(401, 'You\'re not allowed to see this page');
}



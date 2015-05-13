var	server = require('../server');


exports.login = function(req,res)
{
	res.render('layout.ejs', {'page': 'login'});
}

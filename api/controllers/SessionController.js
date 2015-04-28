/**
 * SessionController
 *
 * @description :: Server-side logic for managing sessions
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

 var bcrypt = require('bcrypt');

module.exports = {
	'new': function(req, res){
		res.view('session/new');
	},

	create: function(req, res, next) {
		if (!req.param('email') || !req.param('password')) {
			var usernamePasswordReqquiredError = [{name: 'usernamePasswordRequired', message: 'You must enter both a username and password.'}];

			req.session.flash = {
				err: usernamePasswordRequiredError
			}
			res.redirect('/session/new');
			return;
		}

		User.findOneByEmail(req.param('email')).done(function(err, user){
			if (err) return next(err);

			if (!user) {
				var noAccountError = [{name: 'noAccount', message: 'The email address' + req.param('email') + 'not found.'}];
				req.session.flash = {
					err: noAccountError
				}
				res.redirect('/session/new');
				return;
			}
			bcrypt.compare(req.param('password'), user.encryiptedPassword, function(err, valid){
				if (err) return next(err);

				if (!valid) {
					var usernamePasswordMissmatchError = [{name: 'usernamePasswordMismatch', message: "Ivalid username and password combination."}];
					req.session.flash = {
						err: usernamePasswordMissmatchError
					}
					res.redirect('/session/new');
					return;
				}
				req.session.authenticated = true;
				req.session.User = user;
				res.redirect('/user/show' + user.id);
			});
		});
	}

	
};


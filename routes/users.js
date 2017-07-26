import express from 'express';
import User from '../models/users';
import passport from 'passport';
import passportLocal from 'passport-local';
import bcrypt from 'bcryptjs';

const router = express.Router();
const LocalStrategy = passportLocal.Strategy;

let ensureAuth = (req, res, next) => {
	if(req.isAuthenticated()){
		return next();
	}else{
		req.flash('error_msg', 'Please login to continue');
		res.redirect('/users/login');
	}
}

router.get('/register', (req, res) => {
	if(req.isAuthenticated()){
		res.redirect('/');
	}
	res.render('register.html');
});

router.get('/login', (req, res) => {
	if(req.isAuthenticated()){
		res.redirect('/');
	}
	res.render('login.html');
});

router.post('/register', (req, res) => {
	if(req.isAuthenticated()){
		res.redirect('/');
	}else{
		let username = req.body.username,
			firstname = req.body.firstname,
			lastname = req.body.lastname,
			gender = req.body.gender,
			age = req.body.age,
			email = req.body.email,
			password = req.body.password,
			password1 = req.body.password1;

		req.checkBody('username', 'Username is required').notEmpty();
		req.checkBody('firstname', 'Firstname is required').notEmpty();
		req.checkBody('gender', 'Gender is required').notEmpty();
		req.checkBody('age', 'Age is required').notEmpty();
		req.checkBody('email', 'Email is required').notEmpty();
		req.checkBody('email', 'Invalid email').isEmail();
		req.checkBody('password', 'Password is required').notEmpty();
		req.checkBody('password1', 'Passwords do not match').equals(password);

		var errors = req.validationErrors();

		if(errors){
			let messages = [];
			for(var error of errors){
				messages.push(error);
			}
			req.flash('error_msg', messages);
			res.redirect('/users/register');
		}else{

			User.find({ username : username }, (err, usernames) => {
				User.find({ email : email }, (err, emails) => {
					if(usernames.length != 0){
						req.flash('error_msg', 'Username already in use');
						res.redirect('/users/register');
					}else if(emails.length != 0){
						req.flash('error_msg', 'Email already in use');
						res.redirect('/users/register');
					}else{
						let newUser = new User({
							username : username,
							firstname : firstname,
							lastname : lastname,
							gender : gender,
							age : age,
							email : email,
							password : password
						});

						bcrypt.genSalt(10, (err, salt) => {
							if(err) throw err;
							bcrypt.hash(newUser.password, salt, (err, hash) => {
								if(err) throw err;
								newUser.password = hash;
								let savedUser = newUser.save();
								if(savedUser){
									req.flash("success_msg", "Success creating user");
									res.redirect('/users/login');
								}else{
									req.flash("error_msg", "Error creating user");
									res.redirect('/users/register');
								}
							});
						});
					}
				});
			});
		}
	}
});

passport.use(new LocalStrategy((username, password, done) => {
	User.findOne({ username : username}, (err, user) => {
		if(err) throw err;
		if(!user){
			return done(null, false, { message : 'Credentials don\'t match' });
		}else{
			bcrypt.compare(password, user.password, (err, isMatch) => {
				if(err) throw err;
				if(isMatch){
					return done(null, user, { message : 'Success' });
				}else{
					return done(null, false, { message : 'Credentials don\'t match' });
				}
			});
		}
	});
}));

passport.serializeUser((user, done) => {
	let sessionUser = {
		_id : user._id,
		username : user.username,
		email : user.email
	}
	done(null, sessionUser);
})

passport.deserializeUser((id, done) => {
	User.findById(id, (err, sessionUser) => {
		done(err, sessionUser);
	});
});

router.post('/login',
	passport.authenticate(
		'local',{
			successRedirect:'/dashboard',
			failureRedirect:'/users/login',
			failureFlash: true
		}
	), (req, res) => {
		res.redirect('/');
	}
);

router.get('/logout', ensureAuth, (req, res) => {
	req.logout();
	req.flash("success_msg", "Successfully logged out");
	res.redirect('/login');
});

module.exports = router;
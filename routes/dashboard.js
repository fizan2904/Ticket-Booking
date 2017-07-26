import express from 'express';
import User from '../models/users';
import Train from '../models/trains';
import Ticket from '../models/tickets';

const ensureAuth = (req, res, next) => {
	if(req.isAuthenticated()){
		return next();
	}else{
		req.flash('error_msg', 'Please login to continue');
		res.redirect('/users/login');
	}
}

router.get('/', ensureAuth, (req, res) => {
	const uid = req.session.passport.user._id;
	let user = User.findById(id).exec(),
		tickets = Ticket.find({ uid : uid }).exec();
	if(!user){
		req.flash('error_msg', 'No user found');
		res.redirect('/users/login');
	}else if(tickets.length == 0){
		res.render('withoutTickets', {
			user : user
		});
	}else {
		res.render('withTickets', {
			user : user,
			tickets : tickets
		});
	}
});

module.exports = router;
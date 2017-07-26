import express from 'express';
import Ticket from '../models/tickets';
import User from '../models/users';
import Train from '../models/train';

const router = express.Router();
const ensureAuth = (req, res, next) => {
	if(req.isAuthenticated()){
		return next();
	}else{
		req.flash('error_msg', 'Please login to continue');
		res.redirect('/users/login');
	}
}

router.post('/add/:id', ensureAuth, (req, res) => {
	const uid = req.session.passport.user._id;
	const tid = req.params.id;
	let seat_no = req.body.seat_no;
	seat_no = seat_no.split(",");

	train = Train.findById(tid).exec();
	allTickets = train.train_schedule.seates_taken;
	let exist = false;
	for(var tic in seat_no){
		if(allTickets.includes(tic)){
			exist = true;
		}
	}

	if(exist){
		req.flash('error_msg', 'Seat Number ${tic} is already taken');
		res.redirect('/tickets/add/${tid}');
	}else{
		Ticket.findOneAndUpdate({ uid : uid, tid : tid }, { $push : { seates_taken : seat_no }}, { upsert : true })
			.then(data => Ticket.findById(data.id).exec())
			.catch(err => throw err);
	}

});

module.exports = router;
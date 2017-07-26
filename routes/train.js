import express from 'express';
import Train from '../models/trains';

const router = express.Router();

router.get('/list', (req, res) => {
	let train = Train.find({}).exec();
	res.render('trainList.html', {
		train : train
	});
});

router.get('/list/:id', (req, res) => {
	Train.findById(id, (err, train) => {
		res.render('singleTrain.html', {
			train : train
		});
	});
});

router.get('/add', (req, res) => {
	res.render('addTrain.html');
});

router.post('/add', (req, res) => {
	let newTrain = new Train({
		train_name : req.body.train_name,
		train_details : req.body.train_details,
		train_schedule : [{
			doj : req.body.doj,
			from_place : req.body.from_place,
			from_time : req.body.from_time,
			to_place : req.body.to_place,
			to_time : req.body.to_time,
			seates_taken : [];
		}]
	});

	const train = newTrain.save().exec();
	if(!train){
		req.flash('error_msg', 'Error saving train info');
		res.redirect('/trains/add');
	}else{
		req.flash('success_msg', 'Success saving train info');
		res.redirect('/trains/list');
	}

});
module.exports = router;
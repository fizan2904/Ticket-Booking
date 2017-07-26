import mongoose from 'mongoose';

const schema = mongoose.Schema;
const TrainScheam = new schema({
	train_name : {
		type : String,
		required : true
	},
	train_details : {
		type : String,
	},
	train_schedule : [{
		doj : {
			type : String,
			required : true
		},
		from_place : {
			type : String,
			required : true
		},
		from_time : {
			type : String,
			required : true
		},
		to_place : {
			type : String,
			required : true
		},
		to_time : {
			type : String,
			required : true
		},
		seates_taken : [Number]
	}]
}, {
	collection : 'trains',
	timestamps : true
});

export default mongoose.model('Train', TrainScheam);
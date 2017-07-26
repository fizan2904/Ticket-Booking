import mongoose from 'mongoose';

const schema = mongoose.Schema;
const TicketSchema = new schema({
	uid : {
		type : String,
		required : true
	},
	tid : {
		type : String,
		required : true
	},
	seat_no : {
		type : Number,
		required : true
	}
}, {
	collection : 'tickets',
	timestamps : true
});

export default mongoose.model('Ticket', TicketSchema);
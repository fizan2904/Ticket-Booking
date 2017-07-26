import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const schema = mongoose.Schema;
const UserSchema = new schema({
	username : {
		type : String,
		required : true
	},
	firstname : {
		type : String,
		required : true
	},
	lastname : {
		type : String
	},
	gender : {
		type : Boolean,
		default : true
	},
	age : {
		type : Number
	},
	email : {
		type : String,
		required : true
	},
	password : {
		type : String,
		required : true
	}
}, {
	collection : 'users',
	timestamps : true
});

export default mongoose.model('User', UserSchema);
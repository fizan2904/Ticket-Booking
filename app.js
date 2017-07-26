import express from 'express';
import passport from 'passport';
import expressValidator from 'express-validator';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import flash from 'connect-flash-plus';
import path from 'path';
import ejs from 'ejs';
import mongoose from 'mongoose';
import passportLocal from 'passport-local';

mongoose.connect('mongodb://127.0.0.1/train');
const db = mongoose.connection;
db
	.on('error',() => { 
		console.log("Error connecting database") 
	})

	.once('open', () => {
		console.log("Success connecting to db");
	});

const LocalStrategy = passportLocal.Strategy;
const app = express();

app
	.set('views', path.join(__dirname, 'views'))
	.engine('html', ejs.renderFile)
	.set('view engine', 'ejs')
	.use(express.static('public'))
	.use(bodyParser.json())
	.use(bodyParser.urlencoded({ extended : false }))
	.use(bodyParser.text({ type : 'text/html' }))
	.use(cookieParser())
	.use(session({
		secret : 'BUE@&F6f1265FG%^@r1',
		saveUninitialized : true,
		resave : true
	}))
	.use(passport.initialize())
	.use(passport.session())
	.use(expressValidator({
		errorFormatter : function(param, msg, value){
			var namespace = param.split('.'),
			root = namespace.shift(),
			formParam = root;
			while(namespace.length){
				formParam += '[' + namespace.shift() + ']';
			}return{
				param : formParam,
				msg : msg,
				value : value
			};
		}
	}))
	.use(flash())
	.use(function(req, res, next){
		res.locals.flash = req.flash();
		res.locals.success_msg = req.flash('success_msg');
		res.locals.error_msg = req.flash('error_msg');
		res.locals.error = req.flash('error');
		res.locals.user = req.user || null;
		next();
	});

import index from './routes/index';
import users from './routes/users';
import dashboard from './routes/dashboard';
import train from './routes/train';

app
	.use('/', index)
	.use('/users', users)
	.use('/dashboard', dashboard)
	.use('/train', train);

app.listen((process.env.PORT | 3000), () => {
	console.log("Server started at port 3000");
});
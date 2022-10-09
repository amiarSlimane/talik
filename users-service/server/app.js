const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors');
const bodyParser = require('body-parser')
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const dotenv = require('dotenv');
dotenv.config({
  path: './server/config.env'
});


console.log('process.env.JWT_SECRET ', process.env.JWT_SECRET);
// Start express app

const app = express();

const mongoose = require('mongoose');
 


module.exports = (config) => {

const log = config.log();

const DB = process.env.MODE=='docker'?'mongodb://mongo:27017/'+config.database:'mongodb://localhost:27017/'+config.database;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then(() => console.log('DB connection successful!'));

  

app.enable('trust proxy');
// Set security HTTP headers

app.use(helmet());


// 1) GLOBAL MIDDLEWARES
// Implement CORS
app.use(cors());
app.options('*', cors());



console.log('process.env.NODE_ENV ', process.env.NODE_ENV);
const rabbitmqUrl = process.env.NODE_ENV=='production'?'amqp://rabbitmq_service':'amqp://localhost';
console.log('rabbitmqHost ', rabbitmqUrl);

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 10000,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});

app.use('/users', limiter);

app.use(express.json({ limit: '1000kb' }));


app.use(express.urlencoded({ extended: true, limit: '1000kb' }));


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      //'duration',
    ]
  })
);

app.use(compression());




// 3) ROUTES

const userRoutes = require('./routes/userRoutes');
app.use('/users', userRoutes);
 



app.all('*', (req, res, next) => {
   next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);
return app;
}



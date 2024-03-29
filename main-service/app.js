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
const Comments = require('./services/Comments');
const Users = require('./services/Users');
const configs = require('./config');

// Start express app
const app = express();

app.enable('trust proxy');
// Set security HTTP headers

app.use(helmet());

app.use((req, res, next) => {
  // console.log('req', req)
  next();
});

// 1) GLOBAL MIDDLEWARES
// Implement CORS
app.use(cors());


app.options('*', cors());


// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
// const limiter = rateLimit({
//   max: 10000,
//   windowMs: 60 * 60 * 1000,
//   message: 'Too many requests from this IP, please try again in an hour!'
// });
// app.use('/api', limiter);

app.use(express.json({ limit: '1000kb' }));


app.use(express.urlencoded({ extended: true, limit: '1000kb' }));
app.use(bodyParser.json({ type: 'application/json' }));

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



const config = configs[app.get('env')];

const comments = new Comments(config);
const users = new Users(config);

const routes = require('./routes');
// 3) ROUTES

app.use('/api/v1/', routes({
  comments,
  users,
}));



app.all('*', (req, res, next) => {
   next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);


module.exports = app;



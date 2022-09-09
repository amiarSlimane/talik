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

// Start express app
const app = express();

const mongoose = require('mongoose');
 


module.exports = (config) => {

const log = config.log();


const DB =  "mongodb://localhost:27017/"+config.database;

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


var XFRAME_WHITELIST = ['http://127.0.0.1:4200'];

console.log('process.env.NODE_ENV ', process.env.NODE_ENV);
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

app.use('/api', limiter);

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

const commentRoutes = require('./routes/commentRoutes');
app.use('/comments', commentRoutes);
 





const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Comments micro-service',
      version: '1.0.0',
    },
  },
  apis: ['./server/routes/commentRoutes.js'], // files containing annotations as above
};

const openapiSpecification = swaggerJsdoc(options);

// console.log('./::: ',process.cwd());
// console.log('openapiSpecification ', openapiSpecification);
const swaggerUi = require('swagger-ui-express');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));

app.all('*', (req, res, next) => {
   next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);
return app;
}



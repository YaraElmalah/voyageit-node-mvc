const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const app = express();
const dotenv = require('dotenv');


// Load environment variables from .env file
dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 3000;



app.use(bodyParser.urlencoded({ extended: false }));
// Routes
const homeRoutes = require('./routes/home');
const authRoutes = require('./routes/auth');



const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});
// Other middlewares
app.use(express.static('public'));
app.set('view engine', 'pug');
app.use(
  session({
    secret: process.env.SESSION_ENC,
    resave: false,
    saveUninitialized: false,
    store: store
  })
);

// Middleware for CSRF protection
const csrfProtection = csrf();
app.use(csrfProtection);


// Middleware to set CSRF token in res.locals
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
});

// Routes

app.use('/auth', authRoutes);
app.use(homeRoutes);


mongoose
  .connect(MONGODB_URI)
  .then(result => {
    app.listen(PORT);
  })
  .catch(err => {
    console.log(err);
  });
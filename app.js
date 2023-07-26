const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const app = express();

const MONGODB_URI = 'mongodb+srv://yara:aDYSO9A4VYHU33Ez@cluster0.sx0kpzm.mongodb.net/voyageit';

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
        secret: 'shhhh! this is secret',
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
    app.use(authRoutes);
    app.use(homeRoutes);

    mongoose
    .connect(MONGODB_URI)
    .then(result => {
      app.listen(3000);
    })
    .catch(err => {
      console.log(err);
    });
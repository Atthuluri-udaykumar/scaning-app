const express = require('express')
const connectDb = require('./config/db')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const mongoose = require('mongoose')
const bodyParser = require("body-parser")

// CONFIG files:-
require('dotenv').config();
const app = express()
connectDb();

app.set("view engine", 'ejs')
require("./config/passport")(passport);

// session:-
app.use(session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}))

// passport middlewares:--
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use("/uploads", express.static("uploads"))
app.use(passport.initialize());
app.use(passport.session());

// middleware
app.use("/", require('./routes/api'));
app.use("/file", require('./routes/files'))
app.use("/auth", require('./routes/auth'));
app.use("/user", require('./routes/user'));

const port = process.env.PORT || 2020

app.listen(port, () => console.log(`Example app listening on port ${port}`))
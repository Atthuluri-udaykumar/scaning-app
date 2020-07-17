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
app.use(bodyParser.json())
app.use(passport.initialize());
app.use(passport.session());

// middleware
app.use("/", require('./routes/api'));
app.use("/auth", require('./routes/auth'));

const port = process.env.PORT || 2020

app.listen(port, () => console.log(`Example app listening on port ${port}`))
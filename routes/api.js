const router = require("express").Router();
const passport = require('passport');
const { ensureGust, ensureAuth } = require("../middleware/auth");

router.get('/', (req, res) => {
    res.render("login")
})

router.get("/logout", (req, res) => {
    req.logout();
    res.redirect('/')
})

router.get('/dashbord', ensureAuth, (req, res) => {
    res.render('dashbord')
    // res.send("hello wllcome" + ' ' + req.user.firsrName)
})

module.exports = router;
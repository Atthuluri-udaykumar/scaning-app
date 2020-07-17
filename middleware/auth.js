const e = require("express")

module.exports = {
    ensureAuth: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next()
        } else {
            res.redirect('/')
        }
    },
    ensureGust: function (req, res, next) {
        if (req.isAuthenticated()) {
            return res.redirect('/auth/dashbord')
        } else {
            return next()
        }
    }
}
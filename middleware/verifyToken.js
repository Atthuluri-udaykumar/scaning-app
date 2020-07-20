const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
    let token = req.header("auth_token");
    if (!token) return res.json({
        status: 401,
        msg: "access denied"
    })
    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET)
        res.user = verified;
        next();
    } catch (err) {
        res.json({
            status: 400,
            msg: err
        })
    }
}
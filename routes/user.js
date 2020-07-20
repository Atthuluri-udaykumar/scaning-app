const router = require("express").Router()
const UserSignUp = require('../model/UserSignUp');
const multer = require("multer");
const { signUpValidation, singInValidation } = require("../validations/validate")
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken")
const varify = require('../middleware/verifyToken')

// filter the images:--
function fileFilter(req, file, cb) {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/jpg" || file.mimetype === "image/png") {
        cb(null, true)
    } else {
        cb(null, false)
    }
    cb(new Error('I don\'t have a clue!'))
}

// storage:--
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})
var upload = multer({
    storage: storage, limits: {
        fieldSize: 1024 * 1024 * 5,
        fileFilter: fileFilter
    }
})


router.get('/', varify, (req, res) => {
    UserSignUp.find()
        .then(item => res.json(item))
        .catch(err => res.send(err))
})

router.post("/", upload.single("image_url"), async (req, res) => {
    // backend validations :--
    const { error } = signUpValidation(req.body);
    if (error) return res.json({
        status: 400,
        msg: error.details[0].message
    })

    // email verification:--
    const emailExist = await UserSignUp.findOne({ email: req.body.email });
    if (emailExist) return res.json({
        status: 400,
        msg: "email already exist!"
    })

    // hashing the password using bcsrypt:--
    var salt = await bcrypt.genSaltSync(10);
    var hashpassword = await bcrypt.hashSync(req.body.password, salt);

    let newUser = new UserSignUp({
        fullName: req.body.fullName,
        email: req.body.email,
        password: hashpassword,
        image_url: req.file.path
    })

    try {
        let saveUser = await newUser.save()
        res.send({ user: saveUser._id })
    } catch (err) {
        res.json({
            status: 400,
            msg: err
        });
    }
});

// user login :-

router.post('/login', async (req, res) => {
    // validations using hopijoi
    const { error } = singInValidation(req.body);
    if (error) return res.json({
        status: 400,
        message: error.details[0].message
    });

    // email validation 
    const user = await UserSignUp.findOne({ email: req.body.email })
    if (!user) return res.json({
        status: 400,
        msg: "email is invalid!!!"
    })

    // password vlidations:-
    const passwordValid = await bcrypt.compare(req.body.password, user.password);
    if (!passwordValid) return res.json({
        status: 400,
        msg: "invalid password!!!"
    })

    // creaate jwt token :--
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    res.header("auth_token", token).send(token)
});


module.exports = router
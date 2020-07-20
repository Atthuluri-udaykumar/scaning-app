const Joi = require("@hapi/joi")

const signUpValidation = (data) => {
    let schema = Joi.object({
        fullName: Joi.string().min(3).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),

    })
    return schema.validate(data)
}

const singInValidation = (data) => {
    let schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required()
    })
    return schema.validate(data)
}

module.exports.signUpValidation = signUpValidation
module.exports.singInValidation = singInValidation
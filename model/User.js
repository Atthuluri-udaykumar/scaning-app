const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    googleId: {
        type: String,
        required: true
    },
    displayName: {
        type: String,
        required: true
    },
    firsrName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    img: {
        type: String,

    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("User", userSchema)
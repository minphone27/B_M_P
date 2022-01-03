const mongoose = require("mongoose");

const schema = mongoose.Schema;

const userSchema = new schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false,
    },
    roles: [
        {
            role:{
                type: String,
            },
        },
    ],
    works: [
        {
            work:{
                type: String,
            },
        },
    ],
    
    // avatar: {
    //     type: String,
    //     required: true,
    // },
    tokens: [
        {
            token: {
                type: String,
                required: true,
            },
        },
    ],
}, {timestamps: true});

const User = mongoose.model("User", userSchema);

module.exports = User;
const {body} = require("express-validator");

const signInSchema = [

    body("email").isEmail().withMessage("Wrong credentials"),
    body("password").isLength({min: 6}).withMessage("Wrong credentials"),
];

module.exports = signInSchema;
const {body} = require("express-validator");

const updateSchema= [
    body("name").exists({checkFalsy: true}).withMessage("Please Fill Your Name"),
    body("email").isEmail().withMessage("Please fill your email"),
    body("age").isNumeric().withMessage("Please fill your age"),
    body("address").exists({ chechFalsy: true}).withMessage("Please fill your address"),
];

module.exports = updateSchema;
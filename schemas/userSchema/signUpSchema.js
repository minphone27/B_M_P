const {body} = require("express-validator");

const signUpSchema = [
    body("name").exists({checkFalsy: true}).withMessage("Please Fill Your Name"),
    body("email").isEmail().withMessage("Please fill your email"),
    body("password").isLength({min: 6}).withMessage("Password should be at least 6 characters"),
    body("confirmPassword").custom((value, {req})=>{
        if(value !== req.password){
            throw new Error("Password should be match");
        }
        return true;
    }),
    body("age").isNumeric().withMessage("Please fill your age"),
    body("address").exists({ chechFalsy: true}).withMessage("Please fill your address"),
];

module.exports = signUpSchema;
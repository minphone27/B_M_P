const {body} = require("express-validator");

const changePwSchema = [
    body("prevPw").exists({ checkFalsy: true}).withMessage("Please fill your current password"),
    body("newPw").isLength({ min: 6}).withMessage("Your new Passwoed should be at least 6 characters"),
    body("confirmPw").custom((value, {req})=>{
        if(value !== req.body.newPw){
            throw new Error("Password should be match");
        }
        return true;
    }),
];

module.exports = changePwSchema;
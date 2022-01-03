const {validationResult} = require("express-validator");
const fs = require("fs");

const validateReq = (req, res, next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){

        // fs.unlinkSync(req.file.path);

        return res.status(400).json({errors:errors.array()[0].msg})
    }
    next();
};

module.exports = validateReq;

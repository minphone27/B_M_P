const {validateRequest} = require("express-validator");

const validateReq = (req, res, next)=>{
    const errors = validateRequest(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()[0].msg})
    }
    next();
};

module.exports = validateReq;

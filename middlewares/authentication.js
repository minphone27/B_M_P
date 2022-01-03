const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const auth = async(req, res, next)=>{
    try {
        const token = req.header("Authorization").split(" ")[1];
        const deckode = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({_id: decode._id , "tokens.token" : token});
        if(!user){
            throw new Error();
        }
        req.user = user;
        req.token = token;
        next();
    } catch (error) {
        res.status(400).send("Invalid Token");
    }
}

module.exports = auth;
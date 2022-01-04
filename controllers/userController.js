const bcrypt = require("bcrypt");
const fs = require("fs");
const config = require("../config");
const User = require("../models/userModel");
const generateToken = require("../utils/generateToken");
const transporter = require("../utils/mail");

const getAllUsers = async (req, res)=>{
    try {
        const users = await User.find();
        res.send(users);
    } catch (error) {
        res.status(500);
    }
};

const getSingleUser = async (req, res)=>{
    try {
        const user = await User.findById(req.params.id);
        res.send(user);
    } catch (error) {
        res.status(500);
    }
};

const getMyProfile = async (req, res)=>{
    res.send({
        _id : req.user._id,
        name : req.user.name,
        email : req.user.email,
        isAdmin : req.user.isAdmin,
        age : req.user.age,
        address : req.user.address,
        avatar : req.user.avatar,
        token,
    });
};

const UserSignUp = async (req, res)=>{
    const {name, email, password, age, address} = req.body;
    
    try {
        const hashPw = await bcrypt.hash(password, 8);

        const user = new User({
            name,
            email,
            password: hashPw,
            age,
            address,
            avatar : req.file.path,
        });

        const token = await generateToken(user);
        await user.save();

        const mailOptions = {
            from : config.MAIL_USER,
            to : user.email,
            subject : "Thanks for creating acc",
            text : `Hey ${user.name}. Enjoy our app`,
        };
        transporter.sendMail(mailOptions, (err, info)=>{
            if(err){
                console.log(err);
                return;
            }
            console.log(`Email sent successfully to ${user.email}`);
        })
        res.send({
            _id : user._id,
            name : user.name,
            email : user.email,
            isAdmin : user.isAdmin,
            age : user.age,
            address : user.address,
            avatar : user.avatar,
            token,
        });
    } catch (error) {
        res.status(500).send({error});
    };
};

const UserSignIn = async (req, res)=>{
    try {
        const user = await User.findOne({ email : req.body.email});
        if(user){
            const samePw = await bcrypt.compare(String(req.bosy.password), user.password);
            if(samePw){
                const token = await generateToken(user);
                res.send({
                    _id : user._id,
                    name : user.name,
                    email : user.email,
                    isAdmin : user.isAdmin,
                    age : user.age,
                    address : user.address,
                    avatar : user.avatar,
                    token,
                });
            }else{
                res.status(401).send("Wrong Credentials");

            }
        }else{
            res.status(401).send("Wrong Credentials");
        }
    } catch (error) {
        res.status(401).send("Wrong Credentials");
    }
};

const UserSignOut = async (req, res)=>{
    try {
        req.user.tokens = req.user.tokens.filter(token =>{
            return token.token !== req.token;
        });
        await req.user.save();

        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(500);
    }
};

const UpdateUser = async (req, res)=>{
    try {
        const user = await User.findById(req.user._id);

        req.body.avatar = req.file ? req.file.path : user.avatar;
        if(req.file){
            fs.unlinkSync(user.avatar);
        }

        const updateDate = {
            ...req.body, 
            password: user.password, 
            isAdmin: user.isAdmin, 
            tokens: user.tokens,
        };
        
        const updateuser = await User.findByIdAndUpdate(req.user._id, req.body, {
            new: true,
        });

        res.send({
            _id : updateuser._id,
            name : updateuser.name,
            email : updateuser.email,
            isAdmin : updateuser.isAdmin,
            age : updateuser.age,
            address : updateuser.address,
            avatar : updateuser.avatar,
        });
    } catch (error) {
        res.sendStatus(500);
    }
};

const DeleteUser = async (req, res)=>{
    try {
        const user = await User.findById(req.user._id);
        
        fs.unlinkSync(user.avatar);
        const deletedUser = await user.remove();

        res.status(200);
    } catch (error) {
        res.sendStatus(500);
    }
};

module.exports = {getAllUsers, getSingleUser, getMyProfile,UserSignUp, UserSignIn, UserSignOut, UserSignOut, UpdateUser, DeleteUser};
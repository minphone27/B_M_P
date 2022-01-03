const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const generateToken = require("../utils/generateToken");
const transporter = require("../utils/mail");

const getAllUsers = async (req, res)=>{};

const getSingleUser = async (req, res)=>{};

const getMyProfile = async (req, res)=>{};

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
            // avatar : req.file.path,
        });

        const token = await generateToken(user);
        await user.save();

        // const mailOptions = {
        //     from : config.MAIL_USER,
        //     to : user.email,
        //     subject : "Thanks for creating acc",
        //     text : `Hey ${user.name}. Enjoy our app`,
        // };
        // transporter.sendMail(mailOptions, (err, info)=>{
        //     if(err){
        //         console.log(err);
        //         return;
        //     }
        //     console.log(`Email sent successfully to ${user.email}`);
        // })
        res.send({
            _id : user.id,
            name : user.name,
            email : user.email,
            isAdmin : user.isAdmin,
            age : user.age,
            address : user.address,
            // avatar : user.avatar,
            token,
        });
    } catch (error) {
        res.status(500).send({msg : error.msg});
    };
};

const UserSignIn = async (req, res)=>{};

const UserSignOut = async (req, res)=>{};

const UpdateUser = async (req, res)=>{};

const DeleteUser = async (req, res)=>{};

module.exports = {getAllUsers, getSingleUser, getMyProfile,UserSignUp, UserSignIn, UserSignOut, UserSignOut, UpdateUser, DeleteUser};
const bcrypt = require("bcrypt");
const fs = require("fs");
const config = require("../config");
const Role = require("../models/roleModel");
const User = require("../models/userModel");
const Work = require("../models/workModel");
const generateToken = require("../utils/generateToken");
const transporter = require("../utils/mail");

const getAllUsers = async (req, res)=>{
    try {
        const users = await User.find().populate("works");
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
            console.log("here");
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
            const samePw = await bcrypt.compare(String(req.body.password), user.password);
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

        const updateData= {
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

const changePw = async(req, res)=>{
    try {
        const user = await User.findById(req.user._id);

        const samePw = await bcrypt.compare(String(req.body.prevPw), user.password);

        if(!samePw){
            res.status(400).send("Your previous password is wrong");
            return;
        }
        const hashPw = await bcrypt.hash(req.body.newPw, 8);

        const updateData= {
            name: user.name,
            email: user.email,
            age: user.age,
            address: user.address,
            isAdmin: user.isAdmin,
            avatar: user.avatar,
            tokens: user.tokens,
            password: hashPw,
        };

        const updateuser = await User.findByIdAndUpdate(req.user._id, updateData, {
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
        console.log(error);
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

const assignRole = async(req,res)=>{
    const {id} = req.params;
    const {roleId} = req.body;
    try {
        const role = await Role.findById({_id:roleId});
        role.assignedStaffs.push(id);
        await role.save();

        const staff = await User.findById(id);
        staff.roles.push(role._id)
        await staff.save();

        res.status(200).send(role);
        
    } catch (error) {
        res.status(500).send(error.message);       
    }
};

const unassignRole = async(req, res)=>{
    const {id} = req.params;
    const {roleId} = req.body;
    try {
        const staff = await User.findById(id);
        const unassign_role = await Role.findById(roleId);

        const unassign_roleIndex = staff.roles.indexOf(roleId);
        staff.roles.splice(unassign_roleIndex, 1);
        await unassign_role.save();

        res.status(200).send({staff, unassign_role});
    } catch (error) {
        res.status(500).send(error.message);
    }
}

const assignWork = async (req,res)=>{
    const {id} = req.params;
    const {workId} = req.body;
    try {
        const staff = await User.findById(id);
        staff.works.push(workId);
        await staff.save();

        const work = await Work.findById(workId);
        work.assignedStaffs.push(id);
        await work.save();

        res.status(200).send(staff);

    } catch (error) {
        res.status(500).send(error.message);
    }
}

const unassignWork = async(req,res)=>{
    const {id} = req.params;
    const {workId} = req.body;
    try {
        const staff = await User.findById(id);
        const unassign_work = await Work.findById(workId);

        const unassign_workIndex = staff.works.indexOf(workId);
        staff.works.splice(unassign_workIndex,1);
        await staff.save();

        const staffIndex = unassign_work.assignedStaffs.indexOf(id);
        unassign_work.assignedStaffs.splice(staffIndex,1);
        await unassign_work.save();

        res.status(200).send({staff,unassign_work});

    } catch (error) {
        res.status(500).send(error.message);       
    }
}

const toggleAdmin = async(req, res)=>{
    try {
        const {id} = req.params;

        const adminToEdit = await User.findOne({ _id: id});
        adminToEdit.isAdmin = !adminToEdit.isAdmin;
        const admin = await adminToEdit.save();
        res.send(admin);
    } catch (error) {
        res.sendStatus(500);
    }
}

module.exports = {
    getAllUsers, 
    getSingleUser, 
    getMyProfile,
    UserSignUp, 
    UserSignIn, 
    UserSignOut, 
    UserSignOut, 
    UpdateUser,
    changePw,
    DeleteUser,
    assignRole,
    unassignRole,
    assignWork,
    unassignWork,
    toggleAdmin
};

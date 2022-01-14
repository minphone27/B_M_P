const Role = require("../models/roleModel");
const User = require("../models/userModel");

const getAllRoles = async(req,res)=>{
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1)* limit;
        const total = await Role.countDocuments();
        const pages = Math.ceil(total / limit);
        if(page> pages){
            res.status(404).send("There is no page with this page number");
            return;
        }
        
        const roles = await Role.find().skip(skip).limit(limit).sort({ title: 1});
        res.status(200).send({roles, page, pages, totalRoles: total});

    } catch (error) {
        res.status(500).send(error.message)
    }
};

const getOneRole = async(req,res)=>{
    const {id} = req.params;
    try {
        const {populate} = req.query;
        if(populate){
            const role = await Role.findById({_id:id}).populate("assignedStaffs");
             res.status(200).send(role);
        }else{
            const role = await Role.findById({_id:id});
            res.status(200).send(role);
        }

    } catch (error) {
        res.status(500).send(error.message)
    }
};

const createRole = async(req,res)=>{
    const {title,description} = req.body;

    try {
        const role = new Role({
            title,
            description
        });

        await role.save();

        res.status(200).send(role);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const updateRole = async(req,res)=>{
    const {id} = req.params;
    const {title,description} = req.body;

    try {
        
        const role = await Role.findByIdAndUpdate(id,{title,description},{new:true});

        res.status(200).send(role);

    } catch (error) {
        res.status(500).send(error.message);        
    }
};

const deleteRole = async(req,res)=>{
    const {id} = req.params;
    try {
        
        const roleToDelete = await Role.findByIdAndDelete(id);
        
        roleToDelete.assignedStaffs.forEach( async(id) => {
           const user =  await User.findById(id);
           const roleIndex = user.roles.indexOf(roleToDelete._id);
           user.roles.splice(roleIndex,1)
           await user.save();
        });
        
        res.status(200).send("deleted");

    } catch (error) {
        res.status(500).send(error.message);
    }
};


module.exports = {getAllRoles,getOneRole,createRole,updateRole,deleteRole}
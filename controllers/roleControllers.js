const Role = require("../models/roleModel");
const User = require("../models/userModel");

const getAllRoles = async(req,res)=>{
    try {
        
        const roles = await Role.find();
        res.status(200).send(roles)

    } catch (error) {
        res.status(500).send(error.message)
    }
};

const getOneRole = async(req,res)=>{
    const {id} = req.params;
    try {
        
        const role = await Role.findById({_id:id});
        res.status(200).send(role);

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
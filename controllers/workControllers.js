const Work = require("../models/workModel");
const User = require("../models/userModel");


const getAllWorks = async(req,res)=>{
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const total = await Work.countDocuments();
        const pages = Math.ceil(total / limit); 
        // http://localhost:3000/work?page=1&&limit=5
        if (page > pages){
            res.status(404).send("There is no page with this number");
            return;
        }
        
        const works = await Work.find().skip(skip).limit(limit).sort({ title: 1});
        res.status(200).send({works, page, pages, totalWorks: total});

    } catch (error) {
        res.status(500).send(error.message)
    }
};

const getOneWork = async(req,res)=>{
    const {id} = req.params;
    try {
        const {populate} = req.query;
        if(populate){
            const work = await Work.findById({_id:id}).populate("assignedStaffs");
            res.status(200).send(work);
        }else{
            const work = await Work.findById({_id:id});
            res.status(200).send(work);
        }

    } catch (error) {
        res.status(500).send(error.message)
    }
};

const createWork = async(req,res)=>{
    const {title,description,deadline} = req.body;

    try {
        const work = new Work({
            title,
            description,
            deadline
        });

        await work.save();

        res.status(200).send(work);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const updateWork = async(req,res)=>{
    const {id} = req.params;
    const {title,description,deadline} = req.body;

    try {
        
        const work = await Work.findByIdAndUpdate(id,{title,description,deadline},{new:true});

        res.status(200).send(work);

    } catch (error) {
        res.status(500).send(error.message);        
    }
};

const deleteWork = async(req,res)=>{
    const {id} = req.params;
    try {
        
        const workToDlete = await Work.findByIdAndDelete(id);
        
        workToDlete.assignedStaffs.forEach( async(id) => {
           const user =  await User.findById(id);
           const workIndex = user.works.indexOf(workToDlete._id);
           user.works.splice(workIndex,1)
           await user.save();
        });
        
        res.status(200).send("deleted");

    } catch (error) {
        res.status(500).send(error.message);
    }
};

const assignStaff = async(req,res)=>{
    const {id} = req.params;
    const {staffId} = req.body;
    try {
        const work = await Work.findById({_id:id});
        // console.log(work);
        work.assignedStaffs.push(staffId)
        await work.save();

        const staff = await User.findById(staffId);
        staff.works.push(work._id)
        await staff.save();

        res.status(200).send(work);
        
    } catch (error) {
        res.status(500).send(error.message);       
    }
};

const deleteStaff = async(req,res)=>{
    const {id} = req.params;
    const {staffId} = req.body;
    try {
        const work = await Work.findById(id);
        const unassign_staff = await User.findById(staffId);

        const unassign_staffIndex = work.assignedStaffs.indexOf(staffId);
        work.assignedStaffs.splice(unassign_staffIndex,1);
        await work.save();

        const workIndex = unassign_staff.works.indexOf(id);
        unassign_staff.works.splice(workIndex,1);
        await unassign_staff.save();

        res.status(200).send({work,unassign_staff});

    } catch (error) {
        res.status(500).send(error.message);       
    }
}

module.exports = {getAllWorks,getOneWork,createWork,updateWork,deleteWork,assignStaff,deleteStaff};
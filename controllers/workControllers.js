const Work = require("../models/workModel");

const getAllWorks = async(req,res)=>{
    try {
        
        const works = await Work.find();
        res.status(200).send(works)

    } catch (error) {
        res.status(500).send(error.message)
    }
};

const getOneWork = async(req,res)=>{
    const {id} = req.params;
    try {
        
        const work = await Work.findById({_id:id});
        res.status(200).send(work);

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
        
        const work = await Work.findOneAndDelete(id);
        res.status(200).send(work);

    } catch (error) {
        res.status(500).send(error.message);
    }
};

const assignStaff = async(req,res)=>{
    const {id} = req.params;
    const {staffId} = req.body;
    try {
        const work = await Work.findById({_id:id});
        console.log(work)
        work.assignedStaffs.push(staffId)
        await work.save();
        res.status(200).send(work);
        
    } catch (error) {
        res.status(500).send(error.message);       
    }
};

module.exports = {getAllWorks,getOneWork,createWork,updateWork,deleteWork,assignStaff}
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const workScehma = new Schema({

    title:{
        type:String,
        required:true,
    },

    description:{
        type:String,
        required:true,
    },

    deadline:{
        type:String,
        default:null,
    },

    public: {
        type: Boolean,
        required: true,
        default: true,
    },

    assignedStaffs:[{

        assignedStaff:{
            type:Schema.Types.ObjectId,
            ref:"User",
        },

    }]

},{timestamps:true});

const Work = mongoose.model("Work",workScehma);

module.exports = Work;
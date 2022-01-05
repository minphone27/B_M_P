const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const roleScehma = new Schema({

    title:{
        type:String,
        required:true,
    },

    description:{
        type:String,
        required:true,
    },

    assignedStaffs:[{

        assignedStaff:{
            type:Schema.Types.ObjectId,
            ref:"User",
        },

    }]

});

const Role = mongoose.model("Role",roleScehma);

module.exports = Role;
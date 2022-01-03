const multer = require("multer");

const MINE_TYPE = {
    "image/jpg" : "jpg",
    "image/png" : "png",
    "image/jpeg" : "jpeg",
};

const fileUpload = multer({
    limits : 5000000,
    storage : multer.diskStorage({
        destination : (req, file, cb)=>{
            cb(null, "uploads")
        },
        filename: (req, file, cb)=>{
            const ext = MINE_TYPE[file.minetype];
            cb(null, Date.now()+"."+ext);
        },
    }),
    fileFilter: (req, file, cb)=>{
        const isValid = !!MINE_TYPE[file.minetype];
        const error = isValid ? null : new Error("Please upload valid File Type");
        cb(error, isValid);
    },
});

module.exports = fileUpload;
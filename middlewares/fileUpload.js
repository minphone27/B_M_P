const multer = require("multer");

const MIME_TYPE = {
    "image/jpg" : "jpg",
    "image/png" : "png",
    "image/jpeg" : "jpeg",
};

const fileUpload = multer({
    limits : 5000000,
    storage : multer.diskStorage({
        destination : (req, file, cb)=>{
            cb(null, "upload");
        },
        filename: (req, file, cb)=>{
            const ext = MIME_TYPE[file.mimetype];
            cb(null, Date.now()+"."+ext);
        },
    }),
    fileFilter: (req, file, cb)=>{
        const isValid = !!MIME_TYPE[file.mimetype];
        // console.log({ isValid});//true
        const error = isValid ? null : new Error("Please upload valid File Type");
        cb(error, isValid);
    },
});

module.exports = fileUpload;
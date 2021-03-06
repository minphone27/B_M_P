const { getAllUsers, 
    getSingleUser, 
    getMyProfile, 
    UserSignUp, 
    UserSignIn, 
    UserSignOut, 
    UpdateUser,
    changePw, 
    DeleteUser, 
    assignWork, 
    unassignWork, 
    assignRole, 
    unassignRole,
    toggleAdmin } = require("../controllers/userController");
const fileUpload = require("../middlewares/fileUpload");
const validateReq = require("../middlewares/validateReq");
const signUpSchema = require("../schemas/userSchema/signUpSchema");

const express = require("express");
const signInSchema = require("../schemas/userSchema/signInSchema");
const auth = require("../middlewares/authentication");
const adminMiddleWare = require("../middlewares/admin");
const updateSchema = require("../schemas/userSchema/updateSchema");
const changePwSchema = require("../schemas/userSchema/changePwSchema");

const router = express.Router();

router.get("/", auth, adminMiddleWare,getAllUsers);
router.get("/mine", auth, getMyProfile);
router.get("/:id", auth, adminMiddleWare,getSingleUser);
router.post("/signUp", fileUpload.single("avatar"), signUpSchema, validateReq, UserSignUp);
router.post("/signIn", signInSchema, validateReq, UserSignIn);
router.post("/signOut", auth, UserSignOut);
router.put("/", auth, fileUpload.single("avatar"), updateSchema, validateReq, UpdateUser);
router.put("/changePw", changePwSchema, validateReq, auth, changePw );
router.delete("/:id", auth,adminMiddleWare, DeleteUser);
router.post("/assign_role/:id", auth,adminMiddleWare,assignRole);
router.delete("/unassign_role/:id", auth,adminMiddleWare,unassignRole);
router.post("/assign_work/:id", auth,adminMiddleWare,assignWork);
router.delete("/unassign_work/:id", auth,adminMiddleWare,unassignWork);
router.put("/admin/:id", auth,adminMiddleWare, toggleAdmin);

router.put("/changePw", changePwSchema, validateReq, auth, changePw );



module.exports = router;
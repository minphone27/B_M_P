const { getAllUsers, getSingleUser, getMyProfile, UserSignUp, UserSignIn, UserSignOut, UpdateUser, DeleteUser } = require("../controllers/userController");
const fileUpload = require("../middlewares/fileUpload");
const validateReq = require("../middlewares/validateReq");
const signUpSchema = require("../schemas/userSchema/signUpSchema");

const express = require("express");

const router = express.Router();

router.get("/",getAllUsers)
router.get("/:id",getSingleUser);
router.get("/mine",getMyProfile);
router.post("/signUp", signUpSchema, validateReq, fileUpload.single("avatar"), UserSignUp);
router.post("/signIn",UserSignIn);
router.post("/signOut",UserSignOut);
router.put("/:id", UpdateUser);
router.delete("/:id", DeleteUser);

module.exports = router;
const { getAllUsers, getSingleUser, getMyProfile, UserSignUp, UserSignIn, UserSignOut, UpdateUser, DeleteUser, assignWork, unassignWork } = require("../controllers/userController");
const fileUpload = require("../middlewares/fileUpload");
const validateReq = require("../middlewares/validateReq");
const signUpSchema = require("../schemas/userSchema/signUpSchema");

const express = require("express");
const signInSchema = require("../schemas/userSchema/signInSchema");
const auth = require("../middlewares/authentication");
const adminMiddleWare = require("../middlewares/admin");
const updateSchema = require("../schemas/userSchema/updateSchema");

const router = express.Router();

router.get("/", auth, adminMiddleWare,getAllUsers)
router.get("/mine", auth, getMyProfile);
router.get("/:id", auth, adminMiddleWare,getSingleUser);
router.post("/signUp", fileUpload.single("avatar"), signUpSchema, validateReq, UserSignUp);
router.post("/signIn", signInSchema, validateReq, UserSignIn);
router.post("/signOut", auth, UserSignOut);
router.put("/", auth, fileUpload.single("avatar"), updateSchema, validateReq, UpdateUser);
router.delete("/", auth, DeleteUser);
router.post("/:id",assignWork);
router.delete("/unassigN_work/:id",unassignWork);

module.exports = router;
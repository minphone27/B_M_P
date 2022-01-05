const express = require("express");
const { getAllWorks, getOneWork, createWork, updateWork, deleteWork, assignStaff, deleteStaff, togglePublic } = require("../controllers/workControllers");
const adminMiddleWare = require("../middlewares/admin");
const auth = require("../middlewares/authentication");

const router = express.Router();

router.get("/",getAllWorks);

router.get("/:id",getOneWork);

router.post("/",auth, adminMiddleWare,createWork);

router.put("/:id",auth, adminMiddleWare,updateWork);

router.delete("/:id",auth, adminMiddleWare,deleteWork);

router.post("/:id",auth, adminMiddleWare,assignStaff);

router.delete("/unassign_staff/:id",auth, adminMiddleWare,deleteStaff);

router.put("/public/:id", auth, togglePublic);

module.exports = router;
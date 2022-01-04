const express = require("express");
const { getAllWorks, getOneWork, createWork, updateWork, deleteWork, assignStaff, deleteStaff } = require("../controllers/workControllers");
const adminMiddleWare = require("../middlewares/admin");
const auth = require("../middlewares/authentication");

const router = express.Router();

router.get("/",getAllWorks);

router.get("/:id",getOneWork);

router.post("/",createWork);

router.put("/:id",updateWork);

router.delete("/:id",deleteWork);

router.post("/:id",auth, adminMiddleWare,assignStaff);

router.delete("/unassign_staff/:id",deleteStaff)

module.exports = router;
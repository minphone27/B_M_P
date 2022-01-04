const express = require("express");
const { getAllWorks, getOneWork, createWork, updateWork, deleteWork, assignStaff } = require("../controllers/workControllers");

const router = express.Router();

router.get("/",getAllWorks);

router.get("/:id",getOneWork);

router.post("/",createWork);

router.put("/:id",updateWork);

router.delete("/:id",deleteWork);

router.post("/:id",assignStaff);

module.exports = router;
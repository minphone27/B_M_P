const express = require("express");
const { getAllRoles, getOneRole, createRole, updateRole, deleteRole } = require("../controllers/roleControllers");
const { assignRole, unassignRole } = require("../controllers/userController");
const adminMiddleWare = require("../middlewares/admin");
const auth = require("../middlewares/authentication");

const router = express.Router();

router.get("/",getAllRoles);

router.get("/:id",getOneRole);

router.post("/",auth, adminMiddleWare,createRole);

router.put("/:id",auth, adminMiddleWare,updateRole);

router.delete("/:id",deleteRole);

router.post("/:id", auth, adminMiddleWare, assignRole);

router.delete("/unassign_role/:id", auth, adminMiddleWare, unassignRole);


module.exports = router;
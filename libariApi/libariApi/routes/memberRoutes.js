const express = require("express");
const router = express.Router();
const memberController = require("../controllers/memberController");

router.get("/:id", memberController.getMemberById);
router.get('/', memberController.getAllUsers);
router.get("/", memberController.getUsers);
router.post("/", memberController.addMember);
router.put('/:id', memberController.updateMember);
router.delete('/:id', memberController.deleteMember);

module.exports = router;
    
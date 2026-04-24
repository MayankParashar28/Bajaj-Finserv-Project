const express = require("express");
const router = express.Router();
const bfhlController = require("../controllers/bfhl.controller");

router.post("/", bfhlController.processHierarchies);

module.exports = router;

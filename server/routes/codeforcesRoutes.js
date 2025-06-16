const express = require("express");
const router = express.Router();
const {
  getContests,
  getSubmissions,
  getProblemStats,
} = require("../controllers/syncController");

router.get("/:handle/contests", getContests);
router.get("/:handle/submissions", getSubmissions);
router.get("/:handle/problems", getProblemStats);

module.exports = router;

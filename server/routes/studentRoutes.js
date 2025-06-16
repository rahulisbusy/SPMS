const express = require("express");
const router = express.Router();
const {
  getStudents,
  addStudent,
  updateStudent,
  deleteStudent,
  getStudentById
} = require("../controllers/studentController");

router.get("/", getStudents);
router.get("/:id", getStudentById);
router.post("/", addStudent);
router.put("/:id", updateStudent);
router.delete("/:id", deleteStudent);

module.exports = router;

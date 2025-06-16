const Student=require("../models/student")

exports.getStudents = async (req, res) => {
  const students = await Student.find();
  res.json(students);
};
exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ error: "Student not found" });
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.addStudent = async (req, res) => {
  const student = new Student(req.body);
  await student.save();
  res.status(201).json(student);
};

exports.updateStudent = async (req, res) => {
  const { id } = req.params;

  try {
    const existingStudent = await Student.findById(id);
    if (!existingStudent) {
      return res.status(404).json({ error: "Student not found" });
    }

    const codeforcesHandleChanged =
      req.body.codeforcesHandle &&
      req.body.codeforcesHandle !== existingStudent.codeforcesHandle;

    const updated = await Student.findByIdAndUpdate(id, req.body, { new: true });

    if (codeforcesHandleChanged) {
      await syncStudentCFData(updated); // Immediately sync
    }

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.deleteStudent = async (req, res) => {
  const { id } = req.params;
  await Student.findByIdAndDelete(id);
  res.status(204).end();
};


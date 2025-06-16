const cron = require("node-cron");
const Student = require("../models/student");
const syncStudent = require("../utils/codeforces");

cron.schedule("0 2 * * *", async () => {
  console.log("Running CF Sync at 2 AM");
  const students = await Student.find();

  for (const student of students) {
    try {
      await syncStudent(student);
      console.log(`Synced ${student.name}`);
    } catch (err) {
      console.error(`Failed to sync ${student.name}:`, err.message);
    }
  }
});

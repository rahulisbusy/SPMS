const axios = require("axios");
const Student = require("../models/student");
const CFContest = require("../models/CFContest");
const CFSubmission = require("../models/CFSubmission");

async function syncStudent(student) {
  const handle = student.codeforcesHandle;

  // 1. Fetch Contest History
  const { data: contestData } = await axios.get(`https://codeforces.com/api/user.rating?handle=${handle}`);
  const contests = contestData.result.map((c) => ({
    studentId: student._id,
    contestId: c.contestId,
    contestName: c.contestName,
    rank: c.rank,
    oldRating: c.oldRating,
    newRating: c.newRating,
    ratingChange: c.newRating - c.oldRating,
    contestDate: new Date(c.ratingUpdateTimeSeconds * 1000),
  }));

  await CFContest.deleteMany({ studentId: student._id });
  await CFContest.insertMany(contests);

  // 2. Fetch Submission Data
  const { data: subData } = await axios.get(`https://codeforces.com/api/user.status?handle=${handle}&from=1&count=1000`);
  const accepted = subData.result.filter(s => s.verdict === "OK" && s.problem);

  const submissions = accepted.map(s => ({
  studentId: student._id,
  problemId: s.contestId && s.problem?.index ? `${s.contestId}${s.problem.index}` : "unknown",
  contestId: s.contestId || 0,
  index: s.problem?.index || "",
  name: s.problem?.name || "",
  rating: s.problem?.rating || 0,
  tags: s.problem?.tags || [],
  verdict: s.verdict,
  creationTime: new Date(s.creationTimeSeconds * 1000),
}));


  await CFSubmission.deleteMany({ studentId: student._id });
  await CFSubmission.insertMany(submissions);

  // 3. Update student ratings
  const current = contests.at(-1);
  student.currentRating = current?.newRating || student.currentRating;
  student.maxRating = Math.max(...contests.map(c => c.newRating), 0);
  student.lastSynced = new Date();
  await student.save();
}

module.exports = syncStudent;

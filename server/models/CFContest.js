const mongoose = require("mongoose");

const cfContestSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  contestId: Number,
  contestName: String,
  rank: Number,
  oldRating: Number,
  newRating: Number,
  ratingChange: Number,
  contestDate: Date,
}, { timestamps: true });

// Index for performance on lookups by student
cfContestSchema.index({ studentId: 1 });

module.exports = mongoose.model("CFContest", cfContestSchema);

const mongoose = require("mongoose");

const cfSubmissionSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  problemId: { type: String, required: true },
  contestId: Number,
  index: String,
  name: String,
  rating: Number,
  tags: [String],
  verdict: { type: String, required: true },
  creationTime: { type: Date, required: true },
}, { timestamps: true });

// Indexes for performance
cfSubmissionSchema.index({ studentId: 1 });
cfSubmissionSchema.index({ problemId: 1 });

module.exports = mongoose.model("CFSubmission", cfSubmissionSchema);

const axios = require("axios");

// Utility function to format submissions for heatmap
function buildSubmissionHeatmap(submissions) {
  const map = {};
  submissions.forEach((s) => {
    const date = new Date(s.creationTimeSeconds * 1000).toISOString().split("T")[0];
    if (!map[date]) map[date] = 0;
    map[date]++;
  });
  return Object.entries(map).map(([date, count]) => ({ date, count }));
}

// GET /api/codeforces/:handle/contests
exports.getContests = async (req, res) => {
  const { handle } = req.params;
  try {
    const { data } = await axios.get(`https://codeforces.com/api/user.rating?handle=${handle}`);
    const contests = data.result.map((c) => ({
      contestName: c.contestName,
      rating: c.newRating,
      date: new Date(c.ratingUpdateTimeSeconds * 1000),
    }));
    res.json(contests);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch contest data" });
  }
};

// GET /api/codeforces/:handle/submissions
exports.getSubmissions = async (req, res) => {
  const { handle } = req.params;
  try {
    const { data } = await axios.get(`https://codeforces.com/api/user.status?handle=${handle}&count=1000`);
    const accepted = data.result.filter(s => s.verdict === "OK");
    const heatmap = buildSubmissionHeatmap(accepted);
    res.json(heatmap);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch submissions" });
  }
};

// GET /api/codeforces/:handle/problems?days=30
exports.getProblemStats = async (req, res) => {
  const { handle } = req.params;
  const days = parseInt(req.query.days) || 30;

  try {
    const { data } = await axios.get(`https://codeforces.com/api/user.status?handle=${handle}&count=1000`);
    const now = Date.now();
    const cutoff = now - days * 24 * 60 * 60 * 1000;

    const submissions = data.result.filter((s) =>
      s.verdict === "OK" &&
      s.problem &&
      s.creationTimeSeconds * 1000 > cutoff
    );

    const problemMap = new Map();
    const ratingBuckets = {};
    let totalRating = 0;

    submissions.forEach((s) => {
      const key = `${s.contestId}${s.problem.index}`;
      if (!problemMap.has(key)) {
        const rating = s.problem.rating || 0;
        totalRating += rating;

        // Bucket problems
        const bucket = Math.floor(rating / 100) * 100;
        ratingBuckets[bucket] = (ratingBuckets[bucket] || 0) + 1;

        problemMap.set(key, s);
      }
    });

    const uniqueProblems = Array.from(problemMap.values());
    const avgRating = uniqueProblems.length > 0 ? (totalRating / uniqueProblems.length).toFixed(2) : 0;

    // Max rated problem
    const maxRatedProblem = uniqueProblems.reduce((max, curr) =>
      (curr.problem.rating || 0) > (max.problem?.rating || 0) ? curr : max,
      {}
    );

    // Format for frontend
    const bucketData = Object.entries(ratingBuckets).map(([rating, count]) => ({
      rating,
      count,
    }));

    const heatmap = buildSubmissionHeatmap(submissions);

    res.json({
      total: uniqueProblems.length,
      avgRating,
      avgPerDay: (uniqueProblems.length / days).toFixed(2),
      maxRatedProblem: {
        name: maxRatedProblem.problem?.name || "N/A",
        rating: maxRatedProblem.problem?.rating || "N/A",
      },
      bucketData,
      submissions: heatmap,
    });

  } catch (err) {
    res.status(500).json({ error: "Failed to fetch problem stats" });
  }
};

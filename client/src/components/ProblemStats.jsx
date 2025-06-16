import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { ButtonGroup, Button, CircularProgress, Alert } from "@mui/material";

const ProblemStats = ({ handle }) => {
  const [data, setData] = useState(null);
  const [range, setRange] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const buildStats = (submissions) => {
    const now = Date.now();
    const cutoff = now - range * 24 * 60 * 60 * 1000;

    const solved = submissions.filter(
      (s) =>
        s.verdict === "OK" &&
        s.problem &&
        s.creationTimeSeconds * 1000 > cutoff
    );

    const problemMap = new Map();
    const ratingBuckets = {};
    let totalRating = 0;

    solved.forEach((s) => {
      const key = `${s.contestId}${s.problem.index}`;
      if (!problemMap.has(key)) {
        const rating = s.problem.rating || 0;
        totalRating += rating;
        const bucket = Math.floor(rating / 100) * 100;
        ratingBuckets[bucket] = (ratingBuckets[bucket] || 0) + 1;
        problemMap.set(key, s);
      }
    });

    const uniqueProblems = Array.from(problemMap.values());
    const avgRating =
      uniqueProblems.length > 0
        ? (totalRating / uniqueProblems.length).toFixed(2)
        : 0;

    const maxRated = uniqueProblems.reduce(
      (max, curr) =>
        (curr.problem.rating || 0) > (max.problem?.rating || 0) ? curr : max,
      {}
    );

    const bucketData = Object.entries(ratingBuckets).map(([rating, count]) => ({
      rating,
      count,
    }));

    return {
      total: uniqueProblems.length,
      avgRating,
      avgPerDay: (uniqueProblems.length / range).toFixed(2),
      maxRatedProblem: {
        name: maxRated.problem?.name || "N/A",
        rating: maxRated.problem?.rating || "N/A",
      },
      bucketData,
    };
  };

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `https://codeforces.com/api/user.status?handle=${handle}&count=1000`
        );
        const stats = buildStats(res.data.result);
        setData(stats);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch Codeforces problem stats.");
      } finally {
        setLoading(false);
      }
    };

    if (handle) fetchStats();
  }, [handle, range]);

  // Custom tooltip for the bar chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600">
          <p className="text-sm font-medium text-gray-800 dark:text-white">
            Rating: {label} - {parseInt(label) + 99}
          </p>
          <p className="text-sm text-purple-600 dark:text-purple-400">
            Problems Solved: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  // Color scheme for bars based on difficulty
  const getBarColor = (rating) => {
    const r = parseInt(rating);
    if (r < 1200) return "#10B981"; // Green - Easy
    if (r < 1600) return "#3B82F6"; // Blue - Medium
    if (r < 2000) return "#F59E0B"; // Yellow - Hard
    if (r < 2400) return "#EF4444"; // Red - Very Hard
    return "#8B5CF6"; // Purple - Expert
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-purple-200 dark:border-purple-800 rounded-full animate-spin"></div>
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin absolute top-0"></div>
        </div>
        <p className="mt-4 text-gray-600 dark:text-gray-300 animate-pulse">Analyzing problem statistics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
        <div className="w-12 h-12 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">Failed to Load Statistics</h3>
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 text-center">
        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">No Data Available</h3>
        <p className="text-blue-600 dark:text-blue-400">No problem statistics found for this user.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex flex-wrap gap-2">
        {[7, 30, 90].map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              range === r
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
                : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
            }`}
          >
            Last {r} days
          </button>
        ))}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Solved Card */}
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Total Solved</p>
              <p className="text-3xl font-bold">{data.total}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Average Rating Card */}
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Avg Rating</p>
              <p className="text-3xl font-bold">{data.avgRating}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </div>

        {/* Average per Day Card */}
        <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Avg/Day</p>
              <p className="text-3xl font-bold">{data.avgPerDay}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Hardest Problem Card */}
        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Hardest Problem</p>
              <p className="text-2xl font-bold">{data.maxRatedProblem.rating}</p>
              <p className="text-purple-100 text-xs truncate mt-1" title={data.maxRatedProblem.name}>
                {data.maxRatedProblem.name}
              </p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Problems by Rating Distribution</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Breakdown of solved problems across different difficulty levels
              </p>
            </div>
            <div className="flex items-center space-x-4 text-xs">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-600 dark:text-gray-400">Easy</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600 dark:text-gray-400">Medium</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-gray-600 dark:text-gray-400">Hard</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-gray-600 dark:text-gray-400">Very Hard</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-gray-600 dark:text-gray-400">Expert</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data.bucketData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis 
                dataKey="rating" 
                tick={{ fontSize: 12, fill: '#6B7280' }}
                axisLine={{ stroke: '#E5E7EB' }}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#6B7280' }}
                axisLine={{ stroke: '#E5E7EB' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.5} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {data.bucketData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.rating)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Summary Footer */}
        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Analysis based on <span className="font-semibold">{data.total}</span> unique problems solved in the last <span className="font-semibold">{range}</span> days
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProblemStats;
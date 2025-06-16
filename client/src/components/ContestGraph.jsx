import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { ButtonGroup, Button, CircularProgress, Alert } from "@mui/material";

const ContestGraph = ({ handle }) => {
  const [contests, setContests] = useState([]);
  const [range, setRange] = useState(90);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContests = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `https://codeforces.com/api/user.rating?handle=${handle}`
        );
        const result = res.data.result.map((c) => ({
          ...c,
          date: new Date(c.ratingUpdateTimeSeconds * 1000).toLocaleDateString(),
          delta: c.newRating - c.oldRating,
        }));
        setContests(result);
      } catch (err) {
        console.error("Failed to fetch contests", err);
        setError("Could not load contest data. Invalid handle?");
      } finally {
        setLoading(false);
      }
    };

    if (handle) fetchContests();
  }, [handle]);

  const filteredContests = contests.filter((c) => {
    const daysAgo = (Date.now() - new Date(c.ratingUpdateTimeSeconds * 1000)) / (1000 * 60 * 60 * 24);
    return daysAgo <= range;
  });

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600">
          <p className="font-semibold text-gray-800 dark:text-white">{data.contestName}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">Date: {label}</p>
          <p className="text-sm text-blue-600 dark:text-blue-400">Rating: {data.newRating}</p>
          <p className={`text-sm font-medium ${data.delta >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            Change: {data.delta >= 0 ? '+' : ''}{data.delta}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">Rank: {data.rank}</p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-800 rounded-full animate-spin"></div>
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0"></div>
        </div>
        <p className="mt-4 text-gray-600 dark:text-gray-300 animate-pulse">Loading contest data...</p>
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
        <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">Unable to Load Contest Data</h3>
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (filteredContests.length === 0) {
    return (
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 text-center">
        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">No Contest Data</h3>
        <p className="text-blue-600 dark:text-blue-400">No contests found in the last {range} days.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex flex-wrap gap-2">
        {[30, 90, 365].map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              range === r
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
            }`}
          >
            Last {r} days
          </button>
        ))}
      </div>

      {/* Chart Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Rating Progress</h3>
          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
            <span>Contests: {filteredContests.length}</span>
            <span>•</span>
            <span>
              Latest Rating: {filteredContests.length > 0 ? filteredContests[filteredContests.length - 1].newRating : 'N/A'}
            </span>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={filteredContests} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="ratingGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12, fill: '#6B7280' }}
              axisLine={{ stroke: '#E5E7EB' }}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#6B7280' }}
              axisLine={{ stroke: '#E5E7EB' }}
            />
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.5} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="newRating"
              stroke="#3B82F6"
              strokeWidth={3}
              fill="url(#ratingGradient)"
            />
            <Line
              type="monotone"
              dataKey="newRating"
              stroke="#3B82F6"
              strokeWidth={3}
              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2, fill: '#fff' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Contest List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Recent Contests</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Your performance in the last {range} days
          </p>
        </div>
        
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {filteredContests.slice(-10).reverse().map((contest, i) => (
            <div key={i} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {contest.contestName}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {contest.date} • Rank #{contest.rank}
                  </p>
                </div>
                
                <div className="flex items-center space-x-4 ml-4">
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      {contest.newRating}
                    </div>
                    <div className={`text-xs font-medium ${
                      contest.delta >= 0 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {contest.delta >= 0 ? '+' : ''}{contest.delta}
                    </div>
                  </div>
                  
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    contest.delta >= 0 
                      ? 'bg-green-100 dark:bg-green-900/50' 
                      : 'bg-red-100 dark:bg-red-900/50'
                  }`}>
                    {contest.delta >= 0 ? (
                      <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredContests.length > 10 && (
          <div className="p-4 text-center border-t border-gray-100 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Showing latest 10 contests out of {filteredContests.length} total
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContestGraph;
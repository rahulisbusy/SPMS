import React, { useEffect, useState } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "./styles/heatmap-styles.css";

const HeatMap = ({ handle }) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const buildHeatmapData = (subs) => {
    const map = {};
    subs.forEach((s) => {
      if (s.verdict === "OK") {
        const date = new Date(s.creationTimeSeconds * 1000)
          .toISOString()
          .split("T")[0];
        map[date] = (map[date] || 0) + 1;
      }
    });
    return Object.entries(map).map(([date, count]) => ({ date, count }));
  };

  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!handle) return;

      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `https://codeforces.com/api/user.status?handle=${handle}&count=1000`
        );
        const data = await res.json();

        if (data.status === "OK") {
          setSubmissions(buildHeatmapData(data.result));
        } else {
          setError("Failed to fetch submissions. Please check the handle.");
        }
      } catch (err) {
        console.error("Error loading submissions for heatmap", err);
        setError("Error loading submissions. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [handle]);

  const startDate = new Date(new Date().setFullYear(new Date().getFullYear() - 1));
  const endDate = new Date();

  if (!handle) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Please provide a Codeforces handle to view the submission heatmap
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="text-muted-foreground">Loading submissions...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-semibold mb-4 text-center">
          Codeforces Submissions for {handle}
        </h3>
        <div className="heatmap-container">
          <CalendarHeatmap
            startDate={startDate}
            endDate={endDate}
            values={submissions}
            classForValue={(value) => {
              if (!value) return "color-empty";
              if (value.count >= 10) return "color-github-4";
              if (value.count >= 5) return "color-github-3";
              if (value.count >= 2) return "color-github-2";
              return "color-github-1";
            }}
            showWeekdayLabels={true}
            titleForValue={(value) =>
              value?.date ? `${value.date}: ${value.count} submissions` : "No submissions"
            }
          />
        </div>
        <div className="mt-4 flex items-center justify-center space-x-4 text-sm text-muted-foreground">
          <span>Less</span>
          <div className="flex space-x-1">
            <div className="w-3 h-3 border border-gray-300 bg-gray-100"></div>
            <div className="w-3 h-3 bg-green-200"></div>
            <div className="w-3 h-3 bg-green-400"></div>
            <div className="w-3 h-3 bg-green-600"></div>
            <div className="w-3 h-3 bg-green-800"></div>
          </div>
          <span>More</span>
        </div>
      </div>
    </div>
  );
};

export default HeatMap;
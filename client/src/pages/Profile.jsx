import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ContestGraph from "../components/ContestGraph";
import HeatMap from "../components/HeatMap";
import ProblemStats from "../components/ProblemStats";
import { useDarkMode } from "../context/darkmodeContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faAward, 
  faChartLine, 
  faChartBar, 
  faCalendarAlt,
  faSyncAlt
} from '@fortawesome/free-solid-svg-icons';

const Profile = ({isDark}) => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/students/${id}`)
      .then((res) => setStudent(res.data));
  }, [id]);

  if (!student) return (
    <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="animate-pulse text-2xl font-semibold">
        <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Loading profile...</span>
      </div>
    </div>
  );

  const getRatingColor = (rating) => {
    if (!rating) return "text-gray-500 dark:text-gray-400";
    if (rating >= 2100) return "text-red-600 dark:text-red-400 font-bold";
    if (rating >= 1900) return "text-purple-600 dark:text-purple-400 font-semibold";
    if (rating >= 1600) return "text-blue-600 dark:text-blue-400 font-semibold";
    if (rating >= 1400) return "text-cyan-600 dark:text-cyan-400 font-medium";
    if (rating >= 1200) return "text-green-600 dark:text-green-400 font-medium";
    return "text-gray-600 dark:text-gray-400";
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${isDark ? 'from-gray-900 via-gray-800 to-gray-900' : 'from-blue-50 via-white to-purple-50'}`}>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className={`w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg ${isDark ? 'ring-2 ring-purple-400' : ''}`}>
              {student.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className={`text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent ${isDark ? 'dark:text-purple-100' : ''}`}>
                {student.name}'s Profile
              </h1>
              <p className={`mt-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Competitive Programming Dashboard</p>
            </div>
          </div>
        </div>

  
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          
          <div className={`rounded-2xl shadow-xl p-6 border transition-all duration-300 ${isDark ? 'bg-gray-800 border-gray-700 hover:shadow-purple-500/10' : 'bg-white border-gray-100 hover:shadow-lg'}`}>
            <div className="flex items-center mb-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${isDark ? 'bg-blue-900/50 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                <FontAwesomeIcon icon={faUser} className="w-5 h-5" />
              </div>
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>Contact Info</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center text-sm">
                <span className={`w-16 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Email:</span>
                <span className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>{student.email}</span>
              </div>
              <div className="flex items-center text-sm">
                <span className={`w-16 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Phone:</span>
                <span className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>{student.phone}</span>
              </div>
            </div>
          </div>

          
          <div className={`rounded-2xl shadow-xl p-6 border transition-all duration-300 ${isDark ? 'bg-gray-800 border-gray-700 hover:shadow-orange-500/10' : 'bg-white border-gray-100 hover:shadow-lg'}`}>
            <div className="flex items-center mb-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${isDark ? 'bg-orange-900/50 text-orange-400' : 'bg-orange-100 text-orange-600'}`}>
                <FontAwesomeIcon icon={faAward} className="w-5 h-5" />
              </div>
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>Codeforces</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center text-sm">
                <span className={`w-16 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Handle:</span>
                <span className={`font-mono px-2 py-1 rounded ${isDark ? 'bg-gray-700 text-orange-300' : 'bg-gray-100 text-gray-800'}`}>
                  {student.codeforcesHandle}
                </span>
              </div>
            </div>
          </div>

          {/* Rating Info Card */}
          <div className={`rounded-2xl shadow-xl p-6 border transition-all duration-300 ${isDark ? 'bg-gray-800 border-gray-700 hover:shadow-green-500/10' : 'bg-white border-gray-100 hover:shadow-lg'}`}>
            <div className="flex items-center mb-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${isDark ? 'bg-green-900/50 text-green-400' : 'bg-green-100 text-green-600'}`}>
                <FontAwesomeIcon icon={faChartLine} className="w-5 h-5" />
              </div>
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>Ratings</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Current:</span>
                <span className={`text-2xl font-bold ${getRatingColor(student.currentRating)}`}>
                  {student.currentRating || 'Unrated'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Max:</span>
                <span className={`text-2xl font-bold ${getRatingColor(student.maxRating)}`}>
                  {student.maxRating || 'Unrated'}
                </span>
              </div>
            </div>
          </div>
        </div>

        
        <div className={`rounded-2xl p-6 mb-8 shadow-xl ${isDark ? 'bg-gradient-to-r from-indigo-700 to-purple-800' : 'bg-gradient-to-r from-indigo-500 to-purple-600'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${isDark ? 'bg-white/20 text-white' : 'bg-white/30 text-white'}`}>
                <FontAwesomeIcon icon={faSyncAlt} className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Last Data Sync</h3>
                <p className={`text-sm ${isDark ? 'text-white/80' : 'text-white/90'}`}>
                  {new Date(student.lastSynced).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          </div>
        </div>

        
        <div className="space-y-8">
         
          <div className={`rounded-2xl shadow-xl border overflow-hidden ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
            <div className={`p-6 ${isDark ? 'bg-gradient-to-r from-blue-700 to-indigo-800' : 'bg-gradient-to-r from-blue-600 to-indigo-600'}`}>
              <h2 className="text-2xl font-bold text-white flex items-center">
                <FontAwesomeIcon icon={faChartBar} className="w-6 h-6 mr-3" />
                Contest History
              </h2>
              <p className={`mt-1 ${isDark ? 'text-blue-200' : 'text-blue-100'}`}>Track performance across competitions</p>
            </div>
            <div className="p-6">
              <ContestGraph handle={student.codeforcesHandle} isDark={isDark} />
            </div>
          </div>

          
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Problem Stats */}
            <div className={`rounded-2xl shadow-xl border overflow-hidden ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
              <div className={`p-6 ${isDark ? 'bg-gradient-to-r from-purple-700 to-pink-800' : 'bg-gradient-to-r from-purple-600 to-pink-600'}`}>
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <FontAwesomeIcon icon={faChartLine} className="w-6 h-6 mr-3" />
                  Problem Statistics
                </h2>
                <p className={`mt-1 ${isDark ? 'text-purple-200' : 'text-purple-100'}`}>Analyze problem-solving patterns</p>
              </div>
              <div className="p-6">
                <ProblemStats handle={student.codeforcesHandle} isDark={isDark} />
              </div>
            </div>

            {/* Activity HeatMap */}
            <div className={`rounded-2xl shadow-xl border overflow-hidden ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
              <div className={`p-6 ${isDark ? 'bg-gradient-to-r from-green-700 to-teal-800' : 'bg-gradient-to-r from-green-600 to-teal-600'}`}>
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <FontAwesomeIcon icon={faCalendarAlt} className="w-6 h-6 mr-3" />
                  Activity HeatMap
                </h2>
                <p className={`mt-1 ${isDark ? 'text-green-200' : 'text-green-100'}`}>Visualize daily coding activity</p>
              </div>
              <div className="p-6">
                <HeatMap handle={student.codeforcesHandle} isDark={isDark} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
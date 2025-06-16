import { useDarkMode } from "../context/darkmodeContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faPieChart, faSun } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  const { isDark, setIsDark } = useDarkMode();

  return (
    <header className={`sticky top-0 z-50 ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-md transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
         
          <h1 className={` flex gap-2 justify-between items-center text-xl font-bold ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
           <FontAwesomeIcon icon={faPieChart} className="w-8 h-8 text-green-700 "/> Student Progress Management System
          </h1>

         
          <button
            onClick={() => setIsDark(!isDark)}
            className={`p-2 rounded-full focus:outline-none ${isDark ? 'text-yellow-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-200'} transition-colors duration-200`}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? (
              <FontAwesomeIcon icon={faSun} className="w-5 h-5" />
            ) : (
              <FontAwesomeIcon icon={faMoon} className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
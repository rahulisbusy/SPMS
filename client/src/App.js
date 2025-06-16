import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home"
import StudentProfile from "./components/StudentProfile";
import Profile from "./pages/Profile";
import { useDarkMode } from "./context/darkmodeContext";
import Navbar from "./components/Navbar";

function App() {
    const { isDark, setIsDark } = useDarkMode();
  return (
    <>
    <Navbar/>
     <Router>
      <Routes>
        <Route path="/" element={<Home isDark={isDark}/>} />
        <Route path="/profile/:id" element={<Profile isDark={isDark}/>} />
      </Routes>
    </Router>
    </>
   
  );
}

export default App;

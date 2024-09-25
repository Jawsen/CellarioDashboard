import React from 'react'; 
import './App.css';
import 'tailwindcss/tailwind.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Overview from './components/Overview';
import About from './components/About';

function App() {
  return (
    <Router>
      <div className="min-h-screen grid grid-cols-12 bg-white">
        {/* Slim Sidebar */}
        <div className="w-[10]" style={{ backgroundColor: '#326AA0' }}></div>

        
        {/* Main Content */}
        <div className="col-span-11">
          {/* Blue Header */}
          <Header />
          <div className="p-4">
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/overview" element={<Overview />} />
              <Route path="/about" element={<About />} />
              <Route path="/" element={<Dashboard />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;

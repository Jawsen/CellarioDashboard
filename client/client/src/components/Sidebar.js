import React from 'react';
import { Link } from 'react-router-dom';

function Sidebar() {
  return (
    <div id="sidebar" className="fixed left-0 w-64 h-full bg-[#37474F] text-[#CFD8DC] transition-all duration-500 ease">
      <header className="bg-[#263238] text-xs text-center py-3">
        <Link to="/" className="text-white no-underline">Cellario</Link>
      </header>
      <ul className="flex flex-col">
        <li className="border-b border-[#455A64]">
          <Link to="/dashboard" className="flex items-center px-6 py-4 text-sm no-underline hover:text-[#ECEFF1]">
            <i className="zmdi zmdi-view-dashboard mr-4"></i> Dashboard
          </Link>
        </li>
        <li className="border-b border-[#455A64]">
          <Link to="/overview" className="flex items-center px-6 py-4 text-sm no-underline hover:text-[#ECEFF1]">
            <i className="zmdi zmdi-widgets mr-4"></i> Overview
          </Link>
        </li>
        <li className="border-b border-[#455A64]">
          <Link to="/about" className="flex items-center px-6 py-4 text-sm no-underline hover:text-[#ECEFF1]">
            <i className="zmdi zmdi-info-outline mr-4"></i> About
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;

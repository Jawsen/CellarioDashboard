import React from "react";

function Sidebar() {
  return (
    <div id="sidebar" className="fixed left-0 w-64 h-full bg-[#37474F] text-[#CFD8DC] transition-all duration-500 ease">
      <header className="bg-[#263238] text-xs text-center py-3">
        <a href="#" className="text-white no-underline">Cellario</a>
      </header>
      <ul className="flex flex-col">
        <li className="border-b border-[#455A64]">
          <a href="#" className="flex items-center px-6 py-4 text-sm no-underline hover:text-[#ECEFF1]">
            <i className="zmdi zmdi-view-dashboard mr-4"></i> Dashboard
          </a>
        </li>
        <li className="border-b border-[#455A64]">
          <a href="#" className="flex items-center px-6 py-4 text-sm no-underline hover:text-[#ECEFF1]">
            <i className="zmdi zmdi-widgets mr-4"></i> Overview
          </a>
        </li>
        <li className="border-b border-[#455A64]">
          <a href="#" className="flex items-center px-6 py-4 text-sm no-underline hover:text-[#ECEFF1]">
            <i className="zmdi zmdi-info-outline mr-4"></i> About
          </a>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;

import React from 'react';
import './App.css';
import 'tailwindcss/tailwind.css';
import CellOverview from './components/CellOverview';
import Header from './components/Header';
import History from './components/History';
import OrderSummary from './components/OrderSummary';
import Sidebar from './components/Sidebar';

function App() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12">
      <div className="hidden lg:block lg:col-span-2 h-full">
        <Sidebar />
      </div>
      <div className="lg:col-span-10">
        <Header />
        <div className="p-4">
          <OrderSummary />
          <CellOverview />
          <History />
        </div>
      </div>
    </div>
  );
}

export default App;

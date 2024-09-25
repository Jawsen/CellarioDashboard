import React from 'react';
import OrderSummary from './OrderSummary';
import CellOverview from './CellOverview';
import History from './History';
import OrderChart from './OrderChart';

const Dashboard = () => {
  return (
    <div className="p-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* OrderSummary spans the whole width initially */}
      <div className="lg:col-span-12">
        <OrderSummary />
      </div>

      {/* Left side: OrderChart and History */}
      <div className="lg:col-span-8">
        <OrderChart />
        <History />
      </div>

      {/* Right side: CellOverview positioned below OrderSummary, but to the right */}
      <div className="lg:col-span-4 h-[600px]"> {/* Adjust height as needed */}
        <CellOverview />
      </div>
    </div>
  );
};

export default Dashboard;

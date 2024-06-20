import React from 'react';
import { Grid, Box } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';

const data = [
  { name: 'Started', value: 10 },
  { name: 'Active', value: 30 },
  { name: 'Finished', value: 20 },
  { name: 'Submitted', value: 40 },
];

const COLORS = ['#C8DEBE', '#DAD89E', '#A9A7A7', '#9ED3DA'];

const CellOverview = () => {
  return (
    <Box className=" relative p-5 bg-[#D3E2EF] mr-12 w-[707px] max-w-full rounded-md shadow-sm">
      <div 
        style={{ 
          position: 'absolute', 
          top: 20, 
          right: 20, 
          borderRadius: '50%', 
          padding: '5px',
          backgroundColor: '#D3E2EF' 
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6" style={{ width: '24px', height: '24px' }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
        </svg>
      </div>
      <div className="text-left text-gray-800 mb-5 text-2xl font-bold border-b-2 border-black pb-1">
        Cells overview
      </div>
      <Grid container spacing={2}>
        {[1, 2, 3, 4].map((cellId) => (
          <Grid item xs={12} sm={6} md={3} key={cellId}>
            <div className="flex flex-col items-center text-xs">
              <div className="mt-2 font-bold text-base italic text-gray-800">
                Cell ID: {cellId}
              </div>
              <PieChart width={200} height={100}>
                <Pie
                  data={data}
                  cx={100}
                  cy={50}
                  labelLine={false}
                  outerRadius={40}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CellOverview;

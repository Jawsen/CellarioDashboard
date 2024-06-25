import React, { useState, useEffect } from 'react';
import { Grid, Box } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import axios from 'axios';


const CellOverview = () => {
  const [summary, setSummary] = useState({});

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await axios.get('http://localhost:8000/workcellsummary'); // Adjust endpoint URL
        setSummary(response.data.summary);
      } catch (error) {
        console.error('Error fetching work cell summary:', error);
      }
    };

    fetchSummary();
  }, []);

  return (
    <Box className="relative p-5 bg-[#D3E2EF] mr-12 w-[707px] max-w-full rounded-md shadow-sm">
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
        {/* Optionally add an icon or text */}
      </div>
      <div className="text-left text-gray-800 mb-5 text-2xl font-bold border-b-2 border-black pb-1">
        Cells overview
      </div>
      {/* Legend */}
      <div className="flex justify-center mb-4">
        <div className="mr-4 flex items-center">
          <div
            style={{
              width: '12px',
              height: '12px',
              backgroundColor: '#C8DEBE',
              borderRadius: '50%',
              marginRight: '5px'
            }}
          />
          <span className="text-sm">Active</span>
        </div>
        <div className="mr-4 flex items-center">
          <div
            style={{
              width: '12px',
              height: '12px',
              backgroundColor: '#9ED3DA',
              borderRadius: '50%',
              marginRight: '5px'
            }}
          />
          <span className="text-sm">Submitted</span>
        </div>
        <div className="flex items-center">
          <div
            style={{
              width: '12px',
              height: '12px',
              backgroundColor: '#A9A7A7',
              borderRadius: '50%',
              marginRight: '5px'
            }}
          />
          <span className="text-sm">Finished</span>
        </div>
      </div>
      {/* Grid for Pie Charts */}
      <Grid container spacing={2}>
        {Object.keys(summary).map((workCellName, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <div className="flex flex-col items-center text-xs">
              <div className="mt-2 font-bold text-base italic text-gray-800">
                Work Cell: {workCellName}
              </div>
              <PieChart width={160} height={160}>
                <Pie
                  data={Object.keys(summary[workCellName]).map(statusName => ({
                    name: statusName,
                    value: summary[workCellName][statusName]
                  }))}
                  cx={80}
                  cy={80}
                  labelLine={false}
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {Object.keys(summary[workCellName]).map((statusName, idx) => (
                    <Cell
                      key={`cell-${idx}`}
                      fill={
                        statusName === 'Finished'
                          ? '#A9A7A7'
                          : statusName === 'Submitted'
                          ? '#9ED3DA' 
                          : '#C8DEBE' 
                      }
                    />
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

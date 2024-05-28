import React from 'react';
import './CellOverview.css'; // Import the CSS file
import { Box, Typography, Grid, Paper } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';

const data = [
  { name: 'Started', value: 10 },
  { name: 'Active', value: 30 },
  { name: 'Finished', value: 20 },
  { name: 'Submitted', value: 40 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const renderLabel = (entry) => entry.name;

const CellOverview = () => {
  return (
    <Box className="cell-overview-container">
      <Paper>
        <Typography variant="h6" component="h2" className="cell-overview-title">
          Cells overview
        </Typography>
        <Grid container spacing={2}>
          {[1, 2, 3, 4].map((cellId) => (
            <Grid item xs={12} sm={6} md={3} key={cellId}>
              <div className="cell-chart">
                <Typography variant="subtitle1" component="h3" className="cell-chart-title">
                  Cell ID: {cellId}
                </Typography>
                <PieChart width={200} height={100}>
                  <Pie
                    data={data}
                    cx={100}
                    cy={50}
                    labelLine={false}
                    label={renderLabel}
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
      </Paper>
    </Box>
  );
};

export default CellOverview;

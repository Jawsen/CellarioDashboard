import React from 'react';
import { Box, Paper, Typography } from '@mui/material';

const summaryData = [
  { title: 'Total Orders', value: 100, color: '#326AA0' },
  { title: 'Active Orders', value: 20, color: '#C8DEBE' },
  { title: 'Started Orders', value: 30, color: '#DAD89E' },
  { title: 'Submitted Orders', value: 40, color: '#9ED3DA' },
  { title: 'Finished Orders', value: 10, color: '#A9A7A7' },
];

const OrderSummary = () => {
  return (
    <Box className="flex gap-2.5 p-4 bg-white rounded-lg ml-2.5 mt-2.5 mb-2.5 mr-2.5 items-center justify-start">
      {summaryData.map((data, index) => (
        <Paper
          key={index}
          className="p-4 rounded-lg text-white text-left transition-transform duration-200 ease-in-out min-w-[100px] flex-1 hover:scale-105"
          style={{ backgroundColor: data.color }}
        >
          <Typography className="text-base mb-1.5" variant="h6" style={{ color: 'white' }}>
            {data.title}
          </Typography>
          <Typography className="text-2xl font-bold" variant="h4" style={{ color: 'white' }}>
            {data.value}
            </Typography>
        </Paper>
      ))}
    </Box>
  );
};

export default OrderSummary;

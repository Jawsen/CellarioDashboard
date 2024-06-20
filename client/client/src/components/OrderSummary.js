import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import axios from 'axios'; // Assuming axios is used for HTTP requests

const OrderSummary = () => {
  const [summaryData, setSummaryData] = useState([]);

  useEffect(() => {
    const fetchOrderSummary = async () => {
      try {
        const response = await axios.get('http://localhost:8000/summary'); // Update this URL
        const data = response.data;
        setSummaryData([
          { title: 'Total Orders', value: data.totalOrders, color: '#326AA0' },
          { title: 'Active Orders', value: data.statusCounts['Started'] || 0, color: '#C8DEBE' },
          { title: 'Submitted Orders', value: data.statusCounts['Submitted'] || 0, color: '#9ED3DA' },
          { title: 'Finished Orders', value: data.statusCounts['Finished'] || 0, color: '#A9A7A7' },
        ]);
      } catch (error) {
        console.error('Failed to fetch order summary:', error);
      }
    };

    fetchOrderSummary();
  }, []);

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

import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import './OrderSummary.css'

const summaryData = [
  { title: 'Total Orders', value: 100, color: '#3f51b5' },
  { title: 'Active Orders', value: 20, color: '#8bc34a' },
  { title: 'Started Orders', value: 30, color: '#ffeb3b' },
  { title: 'Submitted Orders', value: 40, color: '#00bcd4' },
  { title: 'Finished Orders', value: 10, color: '#9e9e9e' },
];

const OrderSummary = () => {
  return (
    <Box className="order-summary-container">
        {summaryData.map((data, index) => (
        <Paper key={index} className="order-summary-item" style={{ backgroundColor: data.color }}>
            <Typography className="order-summary-title" variant="h6">
                {data.title}
              </Typography>
              <Typography className="order-summary-value" variant="h4">
                {data.value}
              </Typography>
            </Paper>
    
        ))}
    </Box>
  );
};

export default OrderSummary;

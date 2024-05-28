import React from 'react';
import './History.css';
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

const rows = [
  { id: 1, orderId: 1001, status: 'Active', date: '2022-05-26', owner: 'Owner 1' },
  { id: 2, orderId: 1002, status: 'Submitted', date: '2022-05-25', owner: 'Owner 2' },
  { id: 3, orderId: 1003, status: 'Finished', date: '2022-05-24', owner: 'Owner 3' },
  { id: 4, orderId: 1004, status: 'Started', date: '2022-05-23', owner: 'Owner 4' },
];

const History = () => {
  return (
    <Box className="history-container">
      <Paper>
      <Typography variant="h6" component="h2" className="history-title">
          History
        </Typography>
        <TableContainer className="history-table">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Cell name</TableCell>
                <TableCell>Order ID</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created Date</TableCell>
                <TableCell>Owner</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.orderId}</TableCell>
                  <TableCell>{row.status}</TableCell>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.owner}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default History;

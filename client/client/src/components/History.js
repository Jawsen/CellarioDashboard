import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

const History = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:8000/orders');
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <TableContainer className=" relative w-[707px] overflow-x-auto rounded-lg" style={{ marginTop: '20px' }}>
      <div 
        style={{ 
          position: 'absolute', 
          top: 15, 
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
      <Typography variant="h6" component="h2" className="text-left text-black mb-5 ml-5 bg-[#D3E2EF] p-2">
        History
      </Typography>
      <Table>
        <TableHead className="bg-[#D3E2EF]">
          <TableRow style={{ borderBottom: '2px solid black' }}>
            <TableCell className="p-3 text-left">
              <div style={{ marginBottom: '0.1px' }}>Cell name</div>
            </TableCell>
            <TableCell className="p-3 text-left">
              <div style={{ marginBottom: '0.1px' }}>Order ID</div>
            </TableCell>
            <TableCell className="p-3 text-left">
              <div style={{ marginBottom: '0.1px' }}>Status</div>
            </TableCell>
            <TableCell className="p-3 text-left">
              <div style={{ marginBottom: '0.1px' }}>Created Date</div>
            </TableCell>
            <TableCell className="p-3 text-left">
              <div style={{ marginBottom: '0.1px' }}>End Date</div>
            </TableCell>
            <TableCell className="p-3 text-left">
              <div style={{ marginBottom: '0.1px' }}>Owner</div>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order._id} className="bg-[#D3E2EF] hover:bg-[#6f9bc2]">
              <TableCell className="p-3">{order.WorkCell.name}</TableCell>
              <TableCell className="p-3">{order.ID}</TableCell>
              <TableCell className="p-3">{order.Status.name}</TableCell>
              <TableCell className="p-3">{new Date(order.CreatedDate).toLocaleDateString()}</TableCell>
              <TableCell className="p-3">{order.EndDate ? new Date(order.EndDate).toLocaleDateString() : 'N/A'}</TableCell>
              <TableCell className="p-3">{order.Owner.fullname}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default History;

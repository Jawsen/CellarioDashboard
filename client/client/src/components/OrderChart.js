import React, { useState, useEffect } from 'react';
import {
  Box, Dialog, DialogTitle, DialogContent, DialogActions, Button,
  FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText,
  Grid
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import apiService from '../apiService';

const OrderChart = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [tempSelectedUsers, setTempSelectedUsers] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await apiService.getOrders(); // Fetch orders using your API service
        setOrders(response);
        setFilteredOrders(response); // Initially display all orders
        setUsers([...new Set(response.map(order => order.Owner?.fullname || 'Unknown'))]); // Extract unique users
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  // Function to group orders by user and status for the chart
  const groupOrdersByUser = (orders) => {
    const grouped = {};

    orders.forEach((order) => {
      const ownerName = order.Owner?.fullname || 'Unknown';
      const status = order.Status?.name || 'Unknown';

      if (!grouped[ownerName]) {
        grouped[ownerName] = {
          user: ownerName,
          Active: 0,
          Submitted: 0,
          Canceled: 0,
          Finished: 0,
        };
      }

      // Increment status count
      if (status === 'Active') grouped[ownerName].Active++;
      else if (status === 'Submitted') grouped[ownerName].Submitted++;
      else if (status === 'Canceled') grouped[ownerName].Canceled++;
      else if (status === 'Finished') grouped[ownerName].Finished++;
    });

    return Object.values(grouped); // Convert grouped data to array
  };

  const handleFilterClick = () => {
    setTempSelectedUsers(selectedUsers);
    setFilterDialogOpen(true);
  };

  const applyFilters = () => {
    const filtered = selectedUsers.length > 0
      ? orders.filter(order => selectedUsers.includes(order.Owner?.fullname || 'Unknown'))
      : orders;
    setFilteredOrders(filtered);
    setFilterDialogOpen(false);
  };

  const handleUserChange = (event) => {
    const { value } = event.target;
    setTempSelectedUsers(typeof value === 'string' ? value.split(',') : value);
  };

  const handleClose = () => {
    setFilterDialogOpen(false);
  };

  const chartData = groupOrdersByUser(filteredOrders);

  return (
    <Box className="relative p-5 bg-[#D3E2EF] mr-12 w-[1000px] max-w-full rounded-md shadow-sm">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px' }}>
        <div className="text-left text-gray-800 text-2xl font-bold">
          Orders per User and Status
        </div>
        <button
          onClick={handleFilterClick}
          style={{
            position: 'absolute',
            top: 15,
            right: 20,
            borderRadius: '50%',
            padding: '5px',
            backgroundColor: '#D3E2EF',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6" style={{ width: '24px', height: '24px' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
          </svg>
        </button>
      </div>
      
      <Dialog open={filterDialogOpen} onClose={handleClose} PaperProps={{ style: { backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: '15px' } }}>
        <DialogTitle>Filter by User</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel>User</InputLabel>
            <Select
              multiple
              value={tempSelectedUsers}
              onChange={handleUserChange}
              renderValue={(selected) => selected.join(', ')}
            >
              {users.map((user) => (
                <MenuItem key={user} value={user}>
                  <Checkbox checked={tempSelectedUsers.indexOf(user) > -1} />
                  <ListItemText primary={user} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={applyFilters}>Apply</Button>
        </DialogActions>
      </Dialog>
      
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <XAxis type="number" />
          <YAxis type="category" dataKey="user" />
          <Tooltip />
          <Legend />
          <Bar dataKey="Active" fill="#82ca9d" />
          <Bar dataKey="Submitted" fill="#8884d8" />
          <Bar dataKey="Canceled" fill="#ff8042" />
          <Bar dataKey="Finished" fill="#A9A7A7" />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default OrderChart;

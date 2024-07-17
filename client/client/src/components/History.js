import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Dialog, DialogTitle, DialogContent, Button, DialogActions, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText, IconButton } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import apiService from '../apiService';

const History = () => {
  const [orders, setOrders] = useState([]);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: [],
    owner: [],
    cellname: [],
    orderid: []
  });

  const [statuses, setStatuses] = useState([]);
  const [owners, setOwners] = useState([]);
  const [cellnames, setCellnames] = useState([]);
  const [orderids, setOrderids] = useState([]);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [hoveredOrderId, setHoveredOrderId] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:8000/orders');
        console.log('Fetched orders:', response.data);
        setOrders(response.data);
        const statusSet = new Set(response.data.map(order => order.Status.name));
        statusSet.add('Canceled'); // Ensure "Canceled" is included in the statuses
        setStatuses([...statusSet]);
        setOwners([...new Set(response.data.map(order => order.Owner.fullname))]);
        setCellnames([...new Set(response.data.map(order => order.WorkCell.name))]);
        setOrderids([...new Set(response.data.map(order => order.ID))]);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  const handleFilterClick = () => {
    setFilterDialogOpen(true);
  };

  const handleClose = () => {
    setFilterDialogOpen(false);
    setCancelDialogOpen(false);
  };

  const applyFilters = () => {
    console.log('Applying filters:', filters);
    handleClose();
  };

  const handleFilterChange = (event) => {
    const { target: { name, value } } = event;
    setFilters({
      ...filters,
      [name]: typeof value === 'string' ? value.split(',') : value,
    });
  };

  const handleCancelClick = (order) => {
    console.log('Cancel clicked for order:', order);
    setOrderToCancel(order);
    setCancelDialogOpen(true);
  };

  const confirmCancelOrder = async () => {
    if (!orderToCancel) return;
  
    console.log('Sending request to cancel order:', orderToCancel); // Log the entire order object
    const cancelUrl = `http://localhost:8000/orders/${orderToCancel.ID}/cancel`; // Use ID for number
    console.log('Cancel URL:', cancelUrl); // Log the URL
  
    // Define a timeout promise
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Request timed out')), 10000) // 10 seconds timeout
    );
  
    try {
      const cancelPromise = apiService.cancelOrder(orderToCancel.ID); // Use ID for number
  
      const response = await Promise.race([cancelPromise, timeoutPromise]); // Wait for either the API request or the timeout
      console.log('Order canceled:', response);
  
      setOrders(orders.map(order => 
        order.ID === orderToCancel.ID ? { ...order, Status: { ...order.Status, name: 'Canceled' } } : order
      ));
      handleClose();
    } catch (error) {
      console.error('Error canceling order:', error);
    }
  };

  const filteredOrders = orders.filter(order => {
    return (
      (filters.status.length === 0 || filters.status.includes(order.Status.name)) &&
      (filters.owner.length === 0 || filters.owner.includes(order.Owner.fullname)) &&
      (filters.cellname.length === 0 || filters.cellname.includes(order.WorkCell.name)) &&
      (filters.orderid.length === 0 || filters.orderid.includes(order.ID))
    );
  });

  return (
    <TableContainer className="relative w-[707px] overflow-x-auto rounded-lg" style={{ marginTop: '20px' }}>
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
      <Dialog 
        open={filterDialogOpen} 
        onClose={handleClose} 
        PaperProps={{ 
          style: { 
            backgroundColor: 'rgba(255,255,255,0.8)',
            width: '600px',
            height: '300px',
            position: 'absolute',
            top: '30%',
            right: '20%',
            borderRadius: '15px'
          }
        }}
      >
        <DialogTitle>Filter Orders</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel>Status</InputLabel>
            <Select
              multiple
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              renderValue={(selected) => selected.join(', ')}
            >
              {statuses.map((status) => (
                <MenuItem key={status} value={status}>
                  <Checkbox checked={filters.status.indexOf(status) > -1} />
                  <ListItemText primary={status} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Owner</InputLabel>
            <Select
              multiple
              name="owner"
              value={filters.owner}
              onChange={handleFilterChange}
              renderValue={(selected) => selected.join(', ')}
            >
              {owners.map((owner) => (
                <MenuItem key={owner} value={owner}>
                  <Checkbox checked={filters.owner.indexOf(owner) > -1} />
                  <ListItemText primary={owner} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Cell Name</InputLabel>
            <Select
              multiple
              name="cellname"
              value={filters.cellname}
              onChange={handleFilterChange}
              renderValue={(selected) => selected.join(', ')}
            >
              {cellnames.map((cellname) => (
                <MenuItem key={cellname} value={cellname}>
                  <Checkbox checked={filters.cellname.indexOf(cellname) > -1} />
                  <ListItemText primary={cellname} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Order ID</InputLabel>
            <Select
              multiple
              name="orderid"
              value={filters.orderid}
              onChange={handleFilterChange}
              renderValue={(selected) => selected.join(', ')}
            >
              {orderids.map((orderid) => (
                <MenuItem key={orderid} value={orderid}>
                  <Checkbox checked={filters.orderid.indexOf(orderid) > -1} />
                  <ListItemText primary={orderid} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={applyFilters}>Apply Filters</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={cancelDialogOpen}
        onClose={handleClose}
        PaperProps={{
          style: {
            backgroundColor: 'rgba(255,255,255,0.8)',
            width: '400px',
            height: '200px',
            position: 'absolute',
            top: '30%',
            right: '40%',
            borderRadius: '15px'
          }
        }}
      >
        <DialogTitle>Cancel Order</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to cancel this order?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>No</Button>
          <Button onClick={confirmCancelOrder}>Yes</Button>
        </DialogActions>
      </Dialog>
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
            <TableCell className="p-3 text-left">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredOrders.map((order) => (
            <TableRow 
              key={order._id} 
              className="bg-[#D3E2EF] hover:bg-[#6f9bc2]"
              onMouseEnter={() => setHoveredOrderId(order.ID)}
              onMouseLeave={() => setHoveredOrderId(null)}
            >
              <TableCell className="p-3">{order.WorkCell.name}</TableCell>
              <TableCell className="p-3">{order.ID}</TableCell>
              <TableCell className="p-3">{order.Status.name}</TableCell>
              <TableCell className="p-3">{new Date(order.CreatedDate).toLocaleDateString()}</TableCell>
              <TableCell className="p-3">{order.EndDate ? new Date(order.EndDate).toLocaleDateString() : 'N/A'}</TableCell>
              <TableCell className="p-3">{order.Owner.fullname}</TableCell>
              <TableCell className="p-3">
                {hoveredOrderId === order.ID && (order.Status.name === 'Started' || order.Status.name === 'Submitted') && (
                  <IconButton onClick={() => handleCancelClick(order)}>
                    <CancelIcon />
                  </IconButton>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default History;

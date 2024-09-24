import React, { useEffect, useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, Button, DialogActions,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, IconButton, Menu, MenuItem
} from '@mui/material';
import { ArrowDropDown, MoreVert } from '@mui/icons-material';
import apiService from '../apiService';
import * as XLSX from 'xlsx';

const History = () => {
  const [orders, setOrders] = useState([]);
  const [addOrderDialogOpen, setAddOrderDialogOpen] = useState(false);
  const [newOrder, setNewOrder] = useState({
    description: '',
    owner: '',
    workCell: '',
    status: '',
    endDate: '',
    plates: '',
    notes: ''
  });
  const [filterMenus, setFilterMenus] = useState({
    cellName: null,
    orderId: null,
    status: null,
    createdDate: null,
    endDate: null,
    owner: null,
    plates: null,
  });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [note, setNote] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [filteredOrders, setFilteredOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await apiService.getOrders();
        setOrders(response);
        setFilteredOrders(response); // Set both orders and filtered orders
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
    fetchOrders();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewOrder({ ...newOrder, [name]: value });
  };

  const handleAddOrderClick = () => {
    setAddOrderDialogOpen(true);
  };

  const handleAddOrderClose = () => {
    setAddOrderDialogOpen(false);
  };

  const handleAddOrderSubmit = async () => {
    try {
      const platesArray = newOrder.plates.split(',').map(plate => plate.trim()); // Convert comma-separated plates to array
  
      const orderData = {
        description: newOrder.description,
        owner: newOrder.owner, // This will be the username instead of ObjectID
        workCell: newOrder.workCell, // This will be the work cell name or ID
        status: newOrder.status, // This will be the status name instead of ObjectID
        endDate: newOrder.endDate,
        plates: platesArray, // Plate barcodes instead of ObjectIDs
        notes: newOrder.notes,
        createdDate: new Date().toISOString(), // Add the current date for CreatedDate
      };
  
      // Call the API to add the order
      const response = await apiService.addOrder(orderData);
  
      // Assuming the response contains the newly added order from the server
      setOrders([...orders, response]); // Update the orders state with the new order
      setFilteredOrders([...orders, response]); // Update the filtered orders state as well
      setAddOrderDialogOpen(false); // Close the Add Order dialog
  
      // Reset the form fields
      setNewOrder({
        description: '',
        owner: '',
        workCell: '',
        status: '',
        endDate: '',
        plates: '',
        notes: '',
      });
    } catch (error) {
      console.error('Error adding order:', error);
    }
  };
  
  

  const exportToExcel = () => {
    const formattedOrders = filteredOrders.map(order => ({
      "Cell name": order.WorkCell?.name || 'N/A',
      "Order ID": order.ID || 'N/A',
      "Status": order.Status?.name || 'N/A',
      "Created Date": new Date(order.CreatedDate).toLocaleDateString(),
      "End Date": order.EndDate ? new Date(order.EndDate).toLocaleDateString() : 'N/A',
      "Owner": order.Owner?.fullname || 'N/A',
      "Plates (IDs)": order.Plates ? order.Plates.map(plate => plate.ID).join(', ') : 'No Plates',
      "Notes": order.Notes || 'No Notes'
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedOrders);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');
    XLSX.writeFile(workbook, 'orders.xlsx');
  };

  const handleMenuOpen = (column, event) => {
    setFilterMenus({
      ...filterMenus,
      [column]: event.currentTarget,
    });
  };

  const handleMenuClose = (column) => {
    setFilterMenus({
      ...filterMenus,
      [column]: null,
    });
  };

  const handleFilter = (column, value) => {
    const filtered = orders.filter((order) => {
      if (column === 'cellName') return order.WorkCell?.name === value;
      if (column === 'orderId') return order.ID === value;
      if (column === 'status') return order.Status?.name === value;
      if (column === 'createdDate') return new Date(order.CreatedDate).toLocaleDateString() === value;
      if (column === 'endDate') return new Date(order.EndDate).toLocaleDateString() === value;
      if (column === 'owner') return order.Owner?.fullname === value;
      if (column === 'plates') return order.Plates.some(plate => plate.ID === value);
      return true;
    });
    setFilteredOrders(filtered);
    handleMenuClose(column);
  };

  const getUniqueValues = (key) => {
    if (key === 'createdDate' || key === 'endDate') {
      return [...new Set(orders.filter(order => order[key === 'createdDate' ? 'CreatedDate' : 'EndDate'])
        .map(order => new Date(order[key === 'createdDate' ? 'CreatedDate' : 'EndDate']).toLocaleDateString()))];
    }
    return [...new Set(orders.map(order => {
      if (key === 'cellName') return order.WorkCell?.name || 'N/A';
      if (key === 'orderId') return order.ID || 'N/A';
      if (key === 'status') return order.Status?.name || 'N/A';
      if (key === 'owner') return order.Owner?.fullname || 'N/A';
      if (key === 'plates') return order.Plates?.map(plate => plate.ID).join(', ') || 'N/A';
      return '';
    }))];
  };

  const handleAddNotesClick = (order) => {
    setSelectedOrder(order);
    setNoteDialogOpen(true);
    setNote(order.Notes || ''); // Load existing note if it exists
  };

  const handleCancelOrderClick = async (orderId) => {
    try {
      await apiService.cancelOrder(orderId); // Call the API to cancel the order
      const updatedOrders = orders.map(order => {
        if (order.ID === orderId) {
          return { ...order, Status: { name: 'Cancelled' } };
        }
        return order;
      });
      setOrders(updatedOrders);
      setFilteredOrders(updatedOrders);
    } catch (error) {
      console.error('Error cancelling order:', error);
    }
  };

  const handleNoteSubmit = async () => {
    try {
      await apiService.updateOrderNote(selectedOrder.ID, note); // Save note to backend
      const updatedOrders = orders.map(order => {
        if (order.ID === selectedOrder.ID) {
          return { ...order, Notes: note };
        }
        return order;
      });

      setOrders(updatedOrders);
      setFilteredOrders(updatedOrders);
      setNoteDialogOpen(false);
      setNote('');
    } catch (error) {
      console.error('Error saving notes:', error);
    }
  };

  return (
    <div className="max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-[#363636] scrollbar-track-[#e7e7e7] rounded-lg">
      <div className="flex justify-between items-center p-5">
        <Button onClick={exportToExcel} className="bg-[#217346] text-white p-2 rounded">
          Export to Excel
        </Button>
        <Button onClick={handleAddOrderClick} className="bg-blue-600 text-white p-2 rounded">
          Add New Order
        </Button>
      </div>

      <TableContainer className="relative w-full overflow-x-auto">
        <Table>
          <TableHead className="bg-[#D3E2EF]">
            <TableRow style={{ borderBottom: '2px solid black' }}>
              <TableCell className="p-3 text-left">
                Cell Name
                <IconButton onClick={(e) => handleMenuOpen('cellName', e)}>
                  <ArrowDropDown />
                </IconButton>
                <Menu
                  anchorEl={filterMenus.cellName}
                  open={Boolean(filterMenus.cellName)}
                  onClose={() => handleMenuClose('cellName')}
                >
                  {getUniqueValues('cellName').map((value) => (
                    <MenuItem key={value} onClick={() => handleFilter('cellName', value)}>
                      {value}
                    </MenuItem>
                  ))}
                </Menu>
              </TableCell>
              <TableCell className="p-3 text-left">
                Order ID
                <IconButton onClick={(e) => handleMenuOpen('orderId', e)}>
                  <ArrowDropDown />
                </IconButton>
                <Menu
                  anchorEl={filterMenus.orderId}
                  open={Boolean(filterMenus.orderId)}
                  onClose={() => handleMenuClose('orderId')}
                >
                  {getUniqueValues('orderId').map((value) => (
                    <MenuItem key={value} onClick={() => handleFilter('orderId', value)}>
                      {value}
                    </MenuItem>
                  ))}
                </Menu>
              </TableCell>
              <TableCell className="p-3 text-left">
                Status
                <IconButton onClick={(e) => handleMenuOpen('status', e)}>
                  <ArrowDropDown />
                </IconButton>
                <Menu
                  anchorEl={filterMenus.status}
                  open={Boolean(filterMenus.status)}
                  onClose={() => handleMenuClose('status')}
                >
                  {getUniqueValues('status').map((value) => (
                    <MenuItem key={value} onClick={() => handleFilter('status', value)}>
                      {value}
                    </MenuItem>
                  ))}
                </Menu>
              </TableCell>
              <TableCell className="p-3 text-left">Created Date</TableCell>
              <TableCell className="p-3 text-left">End Date</TableCell>
              <TableCell className="p-3 text-left">Owner</TableCell>
              <TableCell className="p-3 text-left">Plates (IDs)</TableCell>
              <TableCell className="p-3 text-left">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.ID} className="bg-[#D3E2EF] hover:bg-[#6f9bc2]">
                <TableCell className="p-3">{order.WorkCell?.name || 'N/A'}</TableCell>
                <TableCell className="p-3">{order.ID || 'N/A'}</TableCell>
                <TableCell className="p-3">{order.Status?.name || 'N/A'}</TableCell>
                <TableCell className="p-3">{new Date(order.CreatedDate).toLocaleDateString()}</TableCell>
                <TableCell className="p-3">{order.EndDate ? new Date(order.EndDate).toLocaleDateString() : 'N/A'}</TableCell>
                <TableCell className="p-3">{order.Owner?.fullname || 'N/A'}</TableCell>
                <TableCell className="p-3">{order.Plates ? order.Plates.map(plate => plate.ID).join(', ') : 'No Plates'}</TableCell>
                <TableCell className="p-3">
                  <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                    <MoreVert />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={() => setAnchorEl(null)}
                  >
                    <MenuItem onClick={() => handleAddNotesClick(order)}>Add Notes</MenuItem>
                    <MenuItem onClick={() => handleCancelOrderClick(order.ID)}>Cancel Order</MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Order Dialog */}
      <Dialog open={addOrderDialogOpen} onClose={handleAddOrderClose}>
        <DialogTitle>Add New Order</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Description"
            name="description"
            fullWidth
            value={newOrder.description}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Owner"
            name="owner"
            fullWidth
            value={newOrder.owner}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Work Cell"
            name="workCell"
            fullWidth
            value={newOrder.workCell}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Status"
            name="status"
            fullWidth
            value={newOrder.status}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="End Date"
            name="endDate"
            fullWidth
            value={newOrder.endDate}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Plates (comma-separated)"
            name="plates"
            fullWidth
            value={newOrder.plates}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Notes"
            name="notes"
            fullWidth
            value={newOrder.notes}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddOrderClose}>Cancel</Button>
          <Button onClick={handleAddOrderSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>

      {/* Add Notes Dialog */}
      <Dialog open={noteDialogOpen} onClose={() => setNoteDialogOpen(false)}>
        <DialogTitle>Add Notes to Order</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Note"
            name="note"
            fullWidth
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNoteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleNoteSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default History;

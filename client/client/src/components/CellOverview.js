import React, { useState, useEffect } from 'react';
import {
  Box, Dialog, DialogTitle, DialogContent, DialogActions, Button,
  FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText,
  Grid
} from '@mui/material';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import axios from 'axios';

const CellOverview = () => {
  const [summary, setSummary] = useState({});
  const [selectedCells, setSelectedCells] = useState([]);
  const [workCellNames, setWorkCellNames] = useState([]);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [tempSelectedCells, setTempSelectedCells] = useState([]);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await axios.get('http://localhost:8000/workcellsummary'); 
        setSummary(response.data.summary);
        setWorkCellNames(Object.keys(response.data.summary));
      } catch (error) {
        console.error('Error fetching work cell summary:', error);
      }
    };

    fetchSummary();
  }, []);

  const handleFilterClick = () => {
    setTempSelectedCells(selectedCells);
    setFilterDialogOpen(true);
  };

  const handleClose = () => {
    setFilterDialogOpen(false);
  };

  const applyFilters = () => {
    setSelectedCells(tempSelectedCells);
    handleClose();
  };

  const handleCellChange = (event) => {
    const { target: { value } } = event;
    setTempSelectedCells(typeof value === 'string' ? value.split(',') : value);
  };

  const filteredSummary = selectedCells.length > 0
    ? selectedCells.reduce((acc, cell) => {
        if (summary[cell]) acc[cell] = summary[cell];
        return acc;
      }, {})
    : summary;

  return (
    <Box className="relative p-5 bg-[#D3E2EF] mr-12 w-[1000px] max-w-full rounded-md shadow-sm">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px' }}>
        <div className="text-left text-gray-800 text-2xl font-bold">
          Cells Overview
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
        <DialogTitle>Filter by Cell Name</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel>Cell Name</InputLabel>
            <Select
              multiple
              value={tempSelectedCells}
              onChange={handleCellChange}
              renderValue={(selected) => selected.join(', ')}
            >
              {workCellNames.map((cellName) => (
                <MenuItem key={cellName} value={cellName}>
                  <Checkbox checked={tempSelectedCells.indexOf(cellName) > -1} />
                  <ListItemText primary={cellName} />
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
        <div className="mr-4 flex items-center">
          <div
            style={{
              width: '12px',
              height: '12px',
              backgroundColor: '#D9534F',
              borderRadius: '50%',
              marginRight: '5px'
            }}
          />
          <span className="text-sm">Canceled</span>
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
      <Grid container spacing={2}>
        {Object.keys(filteredSummary).map((workCellName, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <div className="flex flex-col items-center text-xs">
              <div className="mt-2 font-bold text-base italic text-gray-800">
                Work Cell: {workCellName}
              </div>
              <PieChart width={160} height={160}>
                <Pie
                  data={Object.keys(filteredSummary[workCellName]).map(statusName => ({
                    name: statusName,
                    value: filteredSummary[workCellName][statusName]
                  }))}
                  cx={80}
                  cy={80}
                  labelLine={false}
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {Object.keys(filteredSummary[workCellName]).map((statusName, idx) => (
                    <Cell
                      key={`cell-${idx}`}
                      fill={
                        statusName === 'Finished'
                          ? '#A9A7A7'
                          : statusName === 'Submitted'
                          ? '#9ED3DA' 
                          : statusName === 'Canceled'
                          ? '#D9534F'
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

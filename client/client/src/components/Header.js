import React from 'react';
import './Header.css'; // Import the CSS file
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

const Header = () => {
  return (
    <AppBar position="static" className="header-appbar">
      <Toolbar className="header-toolbar">
        <Typography variant="h6" component="div" className="header-logo">
          Logo
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

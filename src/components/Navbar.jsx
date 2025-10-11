import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Button, Box, Menu, MenuItem, Fade, Avatar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Homework', path: '/homework' },
    { label: 'Profile', path: '/profile' },
  ];

  return (
    <AppBar position="static" sx={{ backgroundColor: '#00335E' }}>
      <Toolbar className="flex justify-between">
        {/* Logo / Brand */}
        <Box className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
          <Avatar sx={{ bgcolor: '#C99228' }}>BA</Avatar>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Baseline Academy</Typography>
        </Box>

        {/* Desktop Menu */}
        <Box className="hidden md:flex gap-4 items-center">
          {menuItems.map((item) => (
            <Button
              key={item.label}
              onClick={() => navigate(item.path)}
              sx={{
                color: 'white',
                fontWeight: 600,
                '&:hover': { backgroundColor: '#C9922850' },
                textTransform: 'none',
              }}
            >
              {item.label}
            </Button>
          ))}
          <Button
            onClick={handleLogout}
            sx={{
              backgroundColor: '#C99228',
              color: '#00335E',
              fontWeight: 700,
              '&:hover': { backgroundColor: '#e6b043' },
              textTransform: 'none',
            }}
          >
            Logout
          </Button>
        </Box>

        {/* Mobile Menu */}
        <Box className="md:hidden">
          <IconButton color="inherit" onClick={handleMenu}>
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            TransitionComponent={Fade}
          >
            {menuItems.map((item) => (
              <MenuItem
                key={item.label}
                onClick={() => {
                  navigate(item.path);
                  handleClose();
                }}
              >
                {item.label}
              </MenuItem>
            ))}
            <MenuItem
              onClick={() => {
                handleLogout();
                handleClose();
              }}
            >
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

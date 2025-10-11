import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Box,
  Menu,
  MenuItem,
  Fade,
  Avatar,
  Divider
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [profileMenu, setProfileMenu] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const open = Boolean(anchorEl);
  const openProfile = Boolean(profileMenu);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleProfileMenu = (event) => setProfileMenu(event.currentTarget);
  const handleProfileClose = () => setProfileMenu(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Attendance', path: '/attendance' },
    { label: 'Homework', path: '/homework' },
    { label: 'Fees', path: '/fees' },
  ];

  return (
    <AppBar position="static" sx={{ backgroundColor: '#00335E' }}>
      <Toolbar className="flex justify-between">
        {/* Logo / Brand */}
        <Box
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate('/dashboard')}
        >
          <Avatar sx={{ bgcolor: '#C99228' }}>BA</Avatar>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Baseline Academy
          </Typography>
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

          {/* Profile Section */}
          {user ? (
            <Box>
              <Button
                onClick={handleProfileMenu}
                sx={{
                  color: 'white',
                  fontWeight: 600,
                  textTransform: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <Avatar sx={{ bgcolor: '#C99228', width: 32, height: 32 }}>
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </Avatar>
                <ArrowDropDownIcon />
              </Button>
              <Menu
                anchorEl={profileMenu}
                open={openProfile}
                onClose={handleProfileClose}
                TransitionComponent={Fade}
              >
                <MenuItem onClick={() => { navigate('/profile'); handleProfileClose(); }}>
                  Profile
                </MenuItem>
                <Divider />
                <MenuItem onClick={() => { handleLogout(); handleProfileClose(); }}>
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <Button
              onClick={() => navigate('/login')}
              sx={{
                backgroundColor: '#C99228',
                color: '#00335E',
                fontWeight: 700,
                '&:hover': { backgroundColor: '#e6b043' },
                textTransform: 'none',
              }}
            >
              Login
            </Button>
          )}
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
            <Divider />
            {user ? (
              <>
                <MenuItem onClick={() => { navigate('/profile'); handleClose(); }}>
                  Profile
                </MenuItem>
                <MenuItem onClick={() => { handleLogout(); handleClose(); }}>
                  Logout
                </MenuItem>
              </>
            ) : (
              <MenuItem onClick={() => { navigate('/login'); handleClose(); }}>
                Login
              </MenuItem>
            )}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

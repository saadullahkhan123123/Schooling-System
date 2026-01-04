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
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import EventIcon from '@mui/icons-material/Event';
import PersonIcon from '@mui/icons-material/Person';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import SchoolIcon from '@mui/icons-material/School';
import { useNavigate, useLocation } from 'react-router-dom';

const DRAWER_WIDTH = 280;

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileMenu, setProfileMenu] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenu = (event) => setProfileMenu(event.currentTarget);
  const handleProfileClose = () => setProfileMenu(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const getMenuItems = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userRole = user.role || 'student';
    
    if (userRole === 'student') {
      return [
        { label: 'Attendance', path: '/attendance', icon: <EventIcon /> },
        { label: 'Homework', path: '/homework', icon: <AssignmentIcon /> },
        { label: 'Fees', path: '/fees', icon: <AccountBalanceWalletIcon /> },
      ];
    }
    
    if (userRole === 'teacher') {
      return [
        { label: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
        { label: 'Attendance', path: '/attendance', icon: <EventIcon /> },
        { label: 'Homework', path: '/homework', icon: <AssignmentIcon /> },
        { label: 'Fees', path: '/fees', icon: <AccountBalanceWalletIcon /> },
      ];
    }
    
    // Admin
    return [
      { label: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
      { label: 'Attendance', path: '/attendance', icon: <EventIcon /> },
      { label: 'Homework', path: '/homework', icon: <AssignmentIcon /> },
      { label: 'Fees', path: '/fees', icon: <AccountBalanceWalletIcon /> },
      { label: 'Search Student', path: '/search-student', icon: <SchoolIcon /> },
    ];
  };

  const menuItems = getMenuItems();

  const drawer = (
    <Box sx={{ width: DRAWER_WIDTH, height: '100%', bgcolor: '#00335E', color: 'white' }}>
      {/* Logo Section */}
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <Avatar sx={{ bgcolor: '#C99228', width: 40, height: 40 }}>
          BA
        </Avatar>
        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: { xs: '1rem', sm: '1.1rem' } }}>
          Baseline Academy
        </Typography>
      </Box>

      {/* User Info */}
      {user && (
        <Box sx={{ p: 2, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar sx={{ bgcolor: '#C99228', width: 40, height: 40 }}>
              {user.name ? user.name.charAt(0).toUpperCase() : user.username?.charAt(0).toUpperCase() || 'U'}
            </Avatar>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                {user.name || user.username || 'User'}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem', textTransform: 'capitalize' }}>
                {user.role || 'student'}
              </Typography>
            </Box>
          </Box>
        </Box>
      )}

      {/* Menu Items */}
      <List sx={{ pt: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              onClick={() => {
                navigate(item.path);
                setMobileOpen(false);
              }}
              selected={location.pathname === item.path}
              sx={{
                color: 'white',
                '&.Mui-selected': {
                  backgroundColor: '#C99228',
                  '&:hover': { backgroundColor: '#e6b043' },
                },
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
                py: 1.5,
                px: 2,
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.label} 
                primaryTypographyProps={{ 
                  fontSize: '0.95rem', 
                  fontWeight: location.pathname === item.path ? 600 : 400 
                }} 
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 1 }} />

      {/* Profile & Logout */}
      <List>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              navigate('/profile');
              setMobileOpen(false);
            }}
            sx={{
              color: 'white',
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
              py: 1.5,
              px: 2,
            }}
          >
            <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary="Profile" primaryTypographyProps={{ fontSize: '0.95rem' }} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              handleLogout();
              setMobileOpen(false);
            }}
            sx={{
              color: 'white',
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
              py: 1.5,
              px: 2,
            }}
          >
            <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
              <ExitToAppIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" primaryTypographyProps={{ fontSize: '0.95rem' }} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="static" 
        sx={{ 
          backgroundColor: '#00335E',
          boxShadow: 2
        }}
      >
        <Toolbar 
          sx={{ 
            justifyContent: 'space-between',
            minHeight: { xs: '56px', sm: '64px' },
            px: { xs: 1, sm: 2 }
          }}
        >
          {/* Logo / Brand */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              cursor: 'pointer',
              flex: 1
            }}
            onClick={() => {
              const user = JSON.parse(localStorage.getItem('user') || '{}');
              const defaultPath = user.role === 'student' ? '/attendance' : '/dashboard';
              navigate(defaultPath);
            }}
          >
            <Avatar 
              sx={{ 
                bgcolor: '#C99228',
                width: { xs: 32, sm: 40 },
                height: { xs: 32, sm: 40 }
              }}
            >
              BA
            </Avatar>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700,
                fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
                display: { xs: 'none', sm: 'block' }
              }}
            >
              Baseline Academy
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700,
                fontSize: '1rem',
                display: { xs: 'block', sm: 'none' }
              }}
            >
              BA
            </Typography>
          </Box>

          {/* Desktop Menu */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, alignItems: 'center' }}>
            {menuItems.map((item) => (
              <Button
                key={item.label}
                onClick={() => navigate(item.path)}
                sx={{
                  color: 'white',
                  fontWeight: location.pathname === item.path ? 700 : 500,
                  '&:hover': { backgroundColor: 'rgba(201, 146, 40, 0.2)' },
                  textTransform: 'none',
                  fontSize: '0.95rem',
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 1,
                  backgroundColor: location.pathname === item.path ? 'rgba(201, 146, 40, 0.3)' : 'transparent'
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
                    gap: 0.5,
                    ml: 1
                  }}
                >
                  <Avatar sx={{ bgcolor: '#C99228', width: 32, height: 32 }}>
                    {user.name ? user.name.charAt(0).toUpperCase() : user.username?.charAt(0).toUpperCase() || 'U'}
                  </Avatar>
                  <ArrowDropDownIcon sx={{ fontSize: 20 }} />
                </Button>
                <Menu
                  anchorEl={profileMenu}
                  open={Boolean(profileMenu)}
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
                  ml: 1
                }}
              >
                Login
              </Button>
            )}
          </Box>

          {/* Mobile Menu Button */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="end"
            onClick={handleDrawerToggle}
            sx={{ display: { md: 'none' }, ml: 1 }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Box
        component="nav"
        sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </>
  );
};

export default Navbar;

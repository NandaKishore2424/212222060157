import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import AppLogger from '../utils/logger';

const Header = () => {
  React.useEffect(() => {
    AppLogger.info('component', 'Header component mounted');
  }, []);

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          URL Shortener
        </Typography>
        <Box>
          <Button 
            color="inherit" 
            component={Link} 
            to="/"
            onClick={() => AppLogger.info('component', 'Navigation to Home')}
          >
            Shorten URLs
          </Button>
          <Button 
            color="inherit" 
            component={Link} 
            to="/statistics"
            onClick={() => AppLogger.info('component', 'Navigation to Statistics')}
          >
            Statistics
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
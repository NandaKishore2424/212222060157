import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  List, 
  ListItem, 
  ListItemText, 
  Paper,
  Divider,
  Link,
  Button,
  Chip
} from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import { useNavigate } from 'react-router-dom';
import AppLogger from '../utils/logger';

const Statistics = () => {
  const navigate = useNavigate();
  const [shortenedUrls, setShortenedUrls] = useState([]);

  useEffect(() => {
    AppLogger.info('page', 'Statistics page loaded');
    
    const storedUrls = localStorage.getItem('shortenedUrls');
    if (storedUrls) {
      setShortenedUrls(JSON.parse(storedUrls));
      AppLogger.info('page', 'Loaded shortened URLs from local storage');
    }
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const viewStatistics = (shortcode) => {
    AppLogger.info('page', `Navigating to detailed statistics for: ${shortcode}`);
    navigate(`/statistics/${shortcode}`);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          URL Statistics
        </Typography>
        
        {shortenedUrls.length === 0 ? (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body1">
              No shortened URLs available. Create some first!
            </Typography>
            <Button 
              variant="contained" 
              sx={{ mt: 2 }}
              onClick={() => navigate('/')}
            >
              Shorten URLs
            </Button>
          </Paper>
        ) : (
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Your Shortened URLs
            </Typography>
            
            <List>
              {shortenedUrls.map((item, index) => {
                const shortcode = item.shortLink.split('/').pop();
                
                return (
                  <React.Fragment key={index}>
                    {index > 0 && <Divider component="li" />}
                    <ListItem alignItems="flex-start" sx={{ flexDirection: 'column' }}>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                            <Link href={item.shortLink} target="_blank" rel="noopener">
                              {item.shortLink}
                            </Link>
                            <Chip 
                              label={`Expires: ${formatDate(item.expiry)}`} 
                              size="small" 
                              variant="outlined"
                            />
                            <Button 
                              size="small" 
                              variant="contained"
                              startIcon={<BarChartIcon />}
                              onClick={() => viewStatistics(shortcode)}
                            >
                              View Statistics
                            </Button>
                          </Box>
                        }
                      />
                    </ListItem>
                  </React.Fragment>
                );
              })}
            </List>
          </Paper>
        )}
      </Box>
    </Container>
  );
};

export default Statistics;
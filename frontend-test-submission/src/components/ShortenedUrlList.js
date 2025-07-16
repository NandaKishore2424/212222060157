import React from 'react';
import { 
  Paper, 
  Typography, 
  Box, 
  List, 
  ListItem, 
  ListItemText,
  Divider,
  Link,
  Button,
  Chip
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import BarChartIcon from '@mui/icons-material/BarChart';
import { useNavigate } from 'react-router-dom';
import AppLogger from '../utils/logger';

const ShortenedUrlList = ({ shortenedUrls }) => {
  const navigate = useNavigate();

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    AppLogger.info('component', `Copied to clipboard: ${text}`);
  };

  const viewStatistics = (shortcode) => {
    AppLogger.info('component', `Navigating to statistics for: ${shortcode}`);
    navigate(`/statistics/${shortcode}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (!shortenedUrls || shortenedUrls.length === 0) {
    return null;
  }

  return (
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
                        startIcon={<ContentCopyIcon />}
                        onClick={() => copyToClipboard(item.shortLink)}
                      >
                        Copy
                      </Button>
                      <Button 
                        size="small" 
                        startIcon={<BarChartIcon />}
                        onClick={() => viewStatistics(shortcode)}
                      >
                        Stats
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
  );
};

export default ShortenedUrlList;
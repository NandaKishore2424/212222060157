import React, { useState } from 'react';
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  Paper, 
  IconButton,
  Grid,
  InputAdornment,
  Snackbar,
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../services/api';
import AppLogger from '../utils/logger';

const UrlShortenerForm = ({ onUrlsShortened }) => {
  const [urlInputs, setUrlInputs] = useState([
    { url: '', validity: 30, shortcode: '' }
  ]);
  const [errors, setErrors] = useState([{}]);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  const handleUrlChange = (index, field, value) => {
    const newUrlInputs = [...urlInputs];
    newUrlInputs[index][field] = value;
    setUrlInputs(newUrlInputs);
    
    const newErrors = [...errors];
    if (field === 'url') newErrors[index].url = '';
    if (field === 'validity') newErrors[index].validity = '';
    if (field === 'shortcode') newErrors[index].shortcode = '';
    setErrors(newErrors);
  };

  const addUrlInput = () => {
    if (urlInputs.length < 5) {
      setUrlInputs([...urlInputs, { url: '', validity: 30, shortcode: '' }]);
      setErrors([...errors, {}]);
      AppLogger.info('component', 'Added new URL input field');
    } else {
      setNotification({
        open: true,
        message: 'Maximum 5 URLs allowed',
        severity: 'warning'
      });
      AppLogger.warn('component', 'Attempted to add more than 5 URL inputs');
    }
  };

  const removeUrlInput = (index) => {
    if (urlInputs.length > 1) {
      const newUrlInputs = urlInputs.filter((_, i) => i !== index);
      const newErrors = errors.filter((_, i) => i !== index);
      setUrlInputs(newUrlInputs);
      setErrors(newErrors);
      AppLogger.info('component', `Removed URL input at index ${index}`);
    }
  };

  const validateInputs = () => {
    let isValid = true;
    const newErrors = [...errors];

    urlInputs.forEach((input, index) => {
      newErrors[index] = {};

      if (!input.url) {
        newErrors[index].url = 'URL is required';
        isValid = false;
      } else {
        try {
          new URL(input.url);
        } catch (e) {
          newErrors[index].url = 'Invalid URL format';
          isValid = false;
        }
      }

      if (input.validity) {
        const validityNum = Number(input.validity);
        if (isNaN(validityNum) || validityNum <= 0 || !Number.isInteger(validityNum)) {
          newErrors[index].validity = 'Validity must be a positive integer';
          isValid = false;
        }
      }

      if (input.shortcode && !/^[a-zA-Z0-9]{3,10}$/.test(input.shortcode)) {
        newErrors[index].shortcode = 'Shortcode must be 3-10 alphanumeric characters';
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    AppLogger.info('component', 'URL shortening form submitted');

    if (!validateInputs()) {
      AppLogger.warn('component', 'Form validation failed');
      return;
    }

    setIsLoading(true);
    
    try {
      const shortenedUrls = await Promise.all(
        urlInputs.map(input => api.shortenUrl(input))
      );
      
      AppLogger.info('component', `Successfully shortened ${shortenedUrls.length} URLs`);
      
      setNotification({
        open: true,
        message: 'URLs shortened successfully!',
        severity: 'success'
      });
      
      onUrlsShortened(shortenedUrls);
    } catch (error) {
      AppLogger.error('component', `Error shortening URLs: ${error.message}`);
      
      setNotification({
        open: true,
        message: error.response?.data?.message || 'Failed to shorten URLs',
        severity: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Shorten Your URLs
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          Shorten up to 5 URLs at once. Customize validity and shortcode (optional).
        </Typography>
        
        <form onSubmit={handleSubmit}>
          {urlInputs.map((input, index) => (
            <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
              <Grid item xs={12} md={5}>
                <TextField
                  fullWidth
                  label="Long URL"
                  value={input.url}
                  onChange={(e) => handleUrlChange(index, 'url', e.target.value)}
                  error={!!errors[index]?.url}
                  helperText={errors[index]?.url}
                  placeholder="https://example.com/long-url"
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  label="Validity (minutes)"
                  type="number"
                  value={input.validity}
                  onChange={(e) => handleUrlChange(index, 'validity', e.target.value)}
                  error={!!errors[index]?.validity}
                  helperText={errors[index]?.validity}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">min</InputAdornment>
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Custom Shortcode (optional)"
                  value={input.shortcode}
                  onChange={(e) => handleUrlChange(index, 'shortcode', e.target.value)}
                  error={!!errors[index]?.shortcode}
                  helperText={errors[index]?.shortcode}
                  placeholder="abc123"
                />
              </Grid>
              <Grid item xs={12} md={1} sx={{ display: 'flex', alignItems: 'center' }}>
                <IconButton 
                  color="error" 
                  onClick={() => removeUrlInput(index)}
                  disabled={urlInputs.length === 1}
                >
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          ))}
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button
              startIcon={<AddIcon />}
              onClick={addUrlInput}
              disabled={urlInputs.length >= 5 || isLoading}
            >
              Add URL
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              disabled={isLoading}
            >
              {isLoading ? 'Shortening...' : 'Shorten URLs'}
            </Button>
          </Box>
        </form>
      </Paper>
      
      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={() => setNotification({ ...notification, open: false })}
      >
        <Alert 
          onClose={() => setNotification({ ...notification, open: false })} 
          severity={notification.severity}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default UrlShortenerForm;
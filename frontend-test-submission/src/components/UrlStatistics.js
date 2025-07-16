import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Paper, 
  Typography, 
  Box, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Chip,
  Card,
  CardContent,
  Grid,
  Link,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import AppLogger from '../utils/logger';

const UrlStatistics = () => {
  const { shortcode } = useParams();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        if (shortcode) {
          setLoading(true);
          AppLogger.info('page', `Fetching statistics for shortcode: ${shortcode}`);
          const data = await api.getUrlStatistics(shortcode);
          setStats(data);
          AppLogger.info('page', `Statistics loaded for: ${shortcode}`);
        }
      } catch (error) {
        AppLogger.error('page', `Error loading statistics: ${error.message}`);
        setError(error.response?.data?.message || 'Failed to load statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [shortcode]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!stats) {
    return (
      <Alert severity="info" sx={{ my: 2 }}>
        No statistics available.
      </Alert>
    );
  }

  return (
    <Box sx={{ mt: 3 }}>
      <Button 
        startIcon={<ArrowBackIcon />} 
        onClick={() => navigate(-1)}
        sx={{ mb: 2 }}
      >
        Back
      </Button>
      
      <Typography variant="h5" gutterBottom>
        URL Statistics
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                URL Information
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Short URL:</strong>{' '}
                <Link href={`http://localhost:3001/${stats.shortcode}`} target="_blank">
                  {`http://localhost:3001/${stats.shortcode}`}
                </Link>
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Original URL:</strong>{' '}
                <Link href={stats.originalUrl} target="_blank" sx={{ wordBreak: 'break-all' }}>
                  {stats.originalUrl}
                </Link>
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 1 }}>
                <Chip 
                  label={`Created: ${formatDate(stats.createdAt)}`} 
                  variant="outlined"
                  size="small"
                />
                <Chip 
                  label={`Expires: ${formatDate(stats.expiresAt)}`} 
                  variant="outlined"
                  size="small" 
                  color={stats.isActive ? "success" : "error"}
                />
                <Chip 
                  label={`Status: ${stats.isActive ? "Active" : "Expired"}`} 
                  color={stats.isActive ? "success" : "error"}
                  size="small"
                />
                <Chip 
                  label={`Total Clicks: ${stats.totalClicks}`} 
                  color="primary"
                  size="small"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Click History
            </Typography>
            
            {stats.clickHistory.length === 0 ? (
              <Alert severity="info">
                No clicks recorded yet.
              </Alert>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Timestamp</TableCell>
                      <TableCell>Referrer</TableCell>
                      <TableCell>Location</TableCell>
                      <TableCell>User Agent</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stats.clickHistory.map((click, index) => (
                      <TableRow key={index}>
                        <TableCell>{formatDate(click.timestamp)}</TableCell>
                        <TableCell>{click.referrer}</TableCell>
                        <TableCell>{click.location}</TableCell>
                        <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {click.userAgent}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UrlStatistics;
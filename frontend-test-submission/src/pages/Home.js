import React, { useState, useEffect } from 'react';
import { Container, Typography, Box } from '@mui/material';
import UrlShortenerForm from '../components/UrlShortenerForm';
import ShortenedUrlList from '../components/ShortenedUrlList';
import AppLogger from '../utils/logger';

const Home = () => {
  const [shortenedUrls, setShortenedUrls] = useState([]);

  useEffect(() => {
    AppLogger.info('page', 'Home page loaded');

    const storedUrls = localStorage.getItem('shortenedUrls');
    if (storedUrls) {
      setShortenedUrls(JSON.parse(storedUrls));
      AppLogger.info('page', 'Loaded shortened URLs from local storage');
    }
  }, []);

  const handleUrlsShortened = (newUrls) => {
    const updatedUrls = [...newUrls, ...shortenedUrls].slice(0, 10); // Keep last 10 URLs
    setShortenedUrls(updatedUrls);
    localStorage.setItem('shortenedUrls', JSON.stringify(updatedUrls));
    AppLogger.info('page', `Added ${newUrls.length} new shortened URLs`);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          URL Shortener
        </Typography>
        
        <UrlShortenerForm onUrlsShortened={handleUrlsShortened} />
        
        {shortenedUrls.length > 0 && (
          <ShortenedUrlList shortenedUrls={shortenedUrls} />
        )}
      </Box>
    </Container>
  );
};

export default Home;
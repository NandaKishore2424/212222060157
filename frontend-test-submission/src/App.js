import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Container } from '@mui/material';
import './App.css';
import Header from './components/Header';
import Home from './pages/Home';
import Statistics from './pages/Statistics';
import UrlStatistics from './components/UrlStatistics';
import AppLogger from './utils/logger';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

function App() {
  React.useEffect(() => {
    AppLogger.info('component', 'Application started');
    return () => {
      AppLogger.info('component', 'Application closed');
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Header />
        <Container sx={{ py: 4 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path="/statistics/:shortcode" element={<UrlStatistics />} />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;

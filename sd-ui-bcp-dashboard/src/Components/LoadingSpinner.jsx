import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import '../styles/LoadingSpinner.css';

const LoadingSpinner = () => {
  return (
    <Box className='loading-spinner'>

      <CircularProgress color="primary" />
      
    </Box>
  );
};

export default LoadingSpinner;

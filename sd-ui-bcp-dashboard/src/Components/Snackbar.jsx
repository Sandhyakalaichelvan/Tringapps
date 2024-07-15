import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
//import Stack from '@mui/material/Stack';
import '../styles/snackbar.css';




export default function CustomSnackbar({ message, variant, onClose, open }) {
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    onClose();
  };

  let bgColor = ''; 
  if (variant === 'success') {
    bgColor = '#82c971'; // Green color for success variant
  } else if (variant === 'error') { 
     bgColor = '#D16E6E'; 
  }

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      open={open}
      onClose={handleClose}
      autoHideDuration={3000}
    >
      <div style={{ backgroundColor: `${bgColor}`, width: '700px', color: 'black', padding: '10px', borderRadius: '4px', position: 'relative' }}>
        <IconButton
          size="small"
          aria-label="close"
          color="inherit"
          style={{ position: 'absolute', color:'white',top: '50%', left: '50%', transform: 'translate(160%, -50%)', background:'none' }}
          onClick={handleClose}
        >
          <CloseIcon  />
        </IconButton>
        <div style={{color:"white",paddingLeft:'20px',fontFamily:"inherit"}}>{message}</div>
      </div>
    </Snackbar>
  );
}

import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/resetPassword.css';
import { TextField, InputAdornment } from '@mui/material';
import { PortURL } from './Config';
import LoadingSpinner from './LoadingSpinner'; 
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
//import CustomSnackbar from './Snackbar'; 

function ResetNewPassword({ onClose }) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleOldPasswordVisibility = () => {
    setShowOldPassword(!showPassword);  
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);  
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };


  const hasError = (field) => {
    return error && error.toLowerCase().includes(field.toLowerCase());
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true); 
  
    if (newPassword !== confirmNewPassword) {
      setError('Passwords do not match');
      setLoading(false);
  
      setTimeout(() => {
        setError(null);
      }, 5000); // Set timeout to clear the error message after 2 seconds
  
      return;
    }
  
    try {
      const email = localStorage.getItem('email');
  
      const response = await fetch(`${PortURL}/reset-new`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, oldPassword, newPassword }),
      });
  
      if (response.ok) {
        setSuccess(true);
        setOldPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
        setError(null);
        setTimeout(() => {
          onClose();
        }, 3000);
      } else {
        const data = await response.json();
        setError(data.message);
  
        setTimeout(() => {
          setError(null);
        }, 5000); 
      }
    } catch (error) {
      console.error('Error resetting password:', error.message);
      setError('Error resetting password');
  
      setTimeout(() => {
        setError(null);
      }, 5000); 
    }
    setLoading(false); 
  };
  
  


  return (
    <div className="form d-flex justify-content-center align-items-center">
      <Container className="mt-6 p-4 shadow bg-body rounded">
      <span className="close-icon" onClick={onClose}>✖</span>
        <h6 className="text-center mb-3 mt-3 fw-bold">RESET PASSWORD</h6>
        <Form onSubmit={handleSubmit}>
          {error && <div className="text-danger mb-3">{error}</div>}
          {success && <div className="text-success mb-3">Password reset successfully!</div>}
          <Form.Group controlId="formBasicOldPassword" className="mb-4">
          <TextField
            className={`label ${hasError('old password') ? 'error' : ''}`} 
            type={showOldPassword ? 'text' : 'password'}
            label="Old password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            fullWidth
            variant="outlined"
            size="small"
            InputProps={{
              endAdornment: oldPassword && ( 
                <InputAdornment position="end">
                  {showOldPassword ? (
                    <VisibilityIcon onClick={toggleOldPasswordVisibility} />
                  ) : (
                    <VisibilityOffIcon onClick={toggleOldPasswordVisibility} />
                  )}
                </InputAdornment>
              ),
            }}
          />

          </Form.Group>
          <Form.Group controlId="formBasicNewPassword" className="mb-4">
            <TextField
              className={`label ${hasError('new password') ? 'error' : ''}`} // Apply error class if error occurred
              type={showPassword ? 'text' : 'password'}
              label="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              fullWidth
              variant="outlined"
              size="small"
              InputProps={{
                endAdornment: newPassword && ( 
                  <InputAdornment position="end">
                    {showPassword ? (
                      <VisibilityIcon onClick={togglePasswordVisibility} />
                    ) : (
                      <VisibilityOffIcon onClick={togglePasswordVisibility} />
                    )}
                  </InputAdornment>
                ),
              }}
            />
          </Form.Group>
          <Form.Group controlId="formBasicConfirmNewPassword" className="mb-4">
            <TextField
              className={`label ${hasError('confirm new password') ? 'error' : ''}`} // Apply error class if error occurred
              type={showConfirmPassword ? 'text' : 'password'}
              label="Confirm new password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              fullWidth
              variant="outlined"
              size="small"
              InputProps={{
                endAdornment: confirmNewPassword && ( 
                  <InputAdornment position="end">
                    {showConfirmPassword ? (
                      <VisibilityIcon onClick={toggleConfirmPasswordVisibility} />
                    ) : (
                      <VisibilityOffIcon onClick={toggleConfirmPasswordVisibility} />
                    )}
                  </InputAdornment>
                ),
              }}
            />
          </Form.Group>
          <div className="btn-container">
            <Button type="submit" className="btn btn-success rounded-pill submit">
              Reset Password
            </Button>
          </div>
        </Form>
      </Container>
      {loading && <LoadingSpinner />} 
    </div>
  );
}

export default ResetNewPassword;

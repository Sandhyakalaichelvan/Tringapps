import React, { useState,useEffect } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { TextField, InputAdornment } from '@mui/material';
import { PortURL } from './Config';
import LoadingSpinner from './LoadingSpinner';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CustomSnackbar from './Snackbar'; 
import { useNavigate } from 'react-router-dom';
import '../styles/resetPassword.css';


function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailId, setEmailId] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarVariant, setSnackbarVariant] = useState('success');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate(); 

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);  
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };


  useEffect(() => {
    const email = localStorage.getItem('email');
    const session = localStorage.getItem('sessionId');
    setEmailId(email);
    setSessionId(session);
  }, []);
   
   
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
  
    const urlParams = new URLSearchParams(window.location.search);
    const resetToken = urlParams.get('token');
  
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
  
    const requestBody = {
      resetToken: resetToken,
      newPassword: newPassword
    };

    const headers = {
      'Content-Type': 'application/json',
      'Email-ID': emailId,
      'Session-ID': sessionId
    };
  
    try {
      const response = await fetch(`${PortURL}/reset-password`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestBody),
      });
  
      if (response.ok) {
        setSuccess(true);
        setError(null);
        setSnackbarMessage('Password reset successfully!');
        setSnackbarVariant('success');
        setSnackbarOpen(true);
        setTimeout(() => {
          navigate('/login');
        }, 5000);
        }else {
          const data = await response.json();
          // Check if it's an expiration error
          if (response.status === 400 && data.message) {
            setSnackbarMessage('Reset token has expired');
            setSnackbarVariant('error');
            setSnackbarOpen(true);
          } else {
            setError(data.message);
            setSuccess(false);
          }
        }
    } catch (error) {
      console.error('Error resetting password:', error.message);
      setError('Error resetting password');
    }
    setLoading(false);
    setSnackbarOpen(true);
  };
  
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <div className="form d-flex justify-content-center align-items-center">
      <Container className=" mt-6 p-4 shadow bg-body ">
        <h6 className="text-center mb-4 mt-1 ">Reset Password</h6>
        <Form onSubmit={handleSubmit}>
          {error && <div className="text-danger mb-3">{error}</div>}
          {/* {success && <div className="text-success mb-3">Password reset successfully!</div>} */}
          <Form.Group controlId="formBasicNewPassword" className="mb-4">
             <TextField
              className="label"
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

          <Form.Group controlId="formConfirmPassword" className="mb-4">
            <TextField
              className="label"
              type={showConfirmPassword ? 'text' : 'password'}
              label="Confirm password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
              fullWidth
              size="small"

              InputProps={{
                endAdornment: confirmPassword && ( 
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
            <Button type="submit" className="btn btn-success rounded-pill w-100 submit">Reset Password</Button>
          </div>
        </Form>
      </Container>
      <CustomSnackbar
        message={snackbarMessage}
        variant={snackbarVariant}
        onClose={handleCloseSnackbar}
        open={snackbarOpen}
  
        // color={snackColor}


      />
      {loading && <LoadingSpinner />}
    </div>
  );
}

export default ResetPassword;

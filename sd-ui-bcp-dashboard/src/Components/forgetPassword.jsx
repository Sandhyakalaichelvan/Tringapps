import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/forgetPassword.css';
import { TextField } from '@mui/material';
import Header from './Header';
import axios from 'axios';
import { PortURL } from './Config';
import CustomSnackbar from './Snackbar'; 
import LoadingSpinner from './LoadingSpinner'; 

function ForgotPassword({onClose}) {
  const [email, setEmail] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [loading, setLoading] = useState(false); 
  const [snackbarVariant, setSnackbarVariant] = useState('success');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true); 
    try {
      const response = await axios.post(`${PortURL}/forgot-password`, { email });
      if (response.status === 200) {
        setSnackbarMessage(response.data.message);
        setSnackbarVariant('success');

       

      } else if (response.status === 404) {
        setSnackbarMessage(response.data.message);
        setSnackbarVariant('error');
      } else {
        setSnackbarMessage('Error sending reset link email');
        setSnackbarVariant('error');
      }
    } catch (error) {
      setSnackbarMessage(error.response.data.message || 'Error sending reset link email');
      setSnackbarVariant('error');
    }
    setLoading(false); 
    setSnackbarOpen(true);
  };
  
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <div>
      <div>
        <Header />
      </div>
      <div className="form d-flex justify-content-center align-items-center vh-100 ">
        <Container className="shadow p-3 bg-body vh-70 ">
          <h6 className="text-center mb-4 mt-2 forget">Forget Password</h6>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicEmail">
              <TextField
                className='label'
                type="text"
                label="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                size="small"
              />
            </Form.Group>

            <div className="btn-container mt-4 mb-3">
              <Button type="submit" className="btn btn-success  rounded-pill">
               Request Reset Link
              </Button>
            </div>
            <div className="text-center mt ">
              <Link to="/login" className='link'>Back to Login</Link>
            </div>
          </Form>
        </Container>
      </div>
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

export default ForgotPassword;

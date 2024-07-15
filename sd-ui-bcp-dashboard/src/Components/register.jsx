import React, { useState } from 'react';
import { Container, Form, Button, Row, Col} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/register.css';
import { TextField, InputAdornment } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { PortURL } from './Config';
import Header from './Header';
import CustomSnackbar from './Snackbar'; 
import LoadingSpinner from './LoadingSpinner'; 
import { MuiPhone } from './InternationalPhone';

function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  //const [phone, setPhone] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [phoneNumberError, setPhoneNumberError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarVariant, setSnackbarVariant] = useState('success');
  

  const navigate = useNavigate();

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
    setSnackbarMessage('');

  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true); 
  
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
  
    // Validation logic for each field
    if (!firstName) {
      setFirstNameError('First name is required');
      setLoading(false);
      return;
    }
    if (!lastName) {
      setLastNameError('Last name is required');
      setLoading(false);
      return;
    }
    if (!phoneNumber) {
      setPhoneNumberError('Mobile number is required');
      setLoading(false);
      return;
    }
    if (!newPassword) {
      setPasswordError('Password is required');
      setLoading(false);
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      setLoading(false);
      return;
    }
  
    const requestBody = {
      token: token, 
      firstName: firstName,
      lastName: lastName,
      phoneNo: phoneNumber,
      password: newPassword
    };
  
    try {
      const response = await fetch(`${PortURL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
  
      if (response.ok) {
        setLoading(false); 
        const data = await response.json();
        setSnackbarMessage(data.message); 
        setSnackbarOpen(true);
        setSnackbarVariant('success');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        const data = await response.json();
        if (response.status === 400) {
          if (data.errors) {
            if (data.errors.firstName) {
              setFirstNameError(data.errors.firstName);
            }
            if (data.errors.lastName) {
              setLastNameError(data.errors.lastName);
            }
            if (data.errors.phoneNo) {
              setPhoneNumberError(data.errors.phoneNo);
            }
            if (data.errors.password) {
              setSnackbarMessage(data.errors.password);
              setSnackbarOpen(true);
              setSnackbarVariant('error');            }
          } else {
            console.error('Unexpected server error:', data.message);
          }
        } else {
          console.error('Error registering user:', data.message);
        }
        setSnackbarMessage(data.errors.password);
        setSnackbarOpen(true);
        setSnackbarVariant('error');
      }
    } catch (error) {
      setSnackbarMessage('An error occurred while registering.');
      setSnackbarOpen(true);
      setSnackbarVariant('error');
    }
    setLoading(false); 
  };
  
  return (
    <div>
      <Header/>
      <Container className="mt-5 shadow p-3 mb-5 bg-body container vh-70">
        <Form onSubmit={handleSubmit}>
          <h6 className="text-center mb-5 mt-2 display-6 ">Sign up</h6>  
          <Row className="row-cols-1 row-cols-md-2">
            <Col>
              <Form.Group controlId="formFirstName" className="mb-4">
                <TextField
                  className="label"
                  type="text"
                  label="First Name"
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    setFirstNameError('');
                  }}
                  fullWidth
                  size="small"
                  error={!!firstNameError}
                  helperText={firstNameError}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="formLastName" className="mb-4">
                <TextField
                  className="label"
                  type="text"
                  label="Last Name"
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value);
                    setLastNameError('');
                  }}
                  fullWidth
                  size="small"
                  error={!!lastNameError}
                  helperText={lastNameError}
                />
              </Form.Group>
            </Col>
          </Row>
          {/* <Form.Group controlId="formPhoneNumber" className="mb-4">
            <TextField
              className="label"
              type="tel"
              label="Mobile number"
              value={phoneNumber}
              onChange={(e) => {
                const enteredValue = e.target.value.replace(/\D/g, '');
                setPhoneNumber(enteredValue);
                setPhoneNumberError('');
              }}
              fullWidth
              size="small"
              error={!!phoneNumberError}
              helperText={phoneNumberError}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">+91</InputAdornment>
                ),
                inputMode: 'numeric',
              }}
            />
          </Form.Group> */}
           <Form.Group controlId="formPhoneNumber" className="mb-4">
            <MuiPhone
              value={phoneNumber}
              onChange={(phone) => {
                setPhoneNumber(phone);
                setPhoneNumberError('');
              }}
              fullWidth
              size="small"
            />
          </Form.Group>        
          
          <Form.Group controlId="formNewPassword" className="mb-4">
            <TextField
              className="label"
              type={showNewPassword ? 'text' : 'password'}
              label="New password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setPasswordError('');
              }}
              fullWidth
              size="small"
              error={!!passwordError}
              helperText={passwordError}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {showNewPassword ? (
                      <VisibilityIcon onClick={toggleNewPasswordVisibility} />
                    ) : (
                      <VisibilityOffIcon onClick={toggleNewPasswordVisibility} />
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
                setPasswordError('');
              }}
              fullWidth
              size="small"
              error={!!passwordError}
              helperText={passwordError}
              InputProps={{
                endAdornment: (
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
          <div className="btn-container mt-5 mb-2">
            <Button type="submit" className="btn btn-success  rounded-pill submit">
              Submit
            </Button>
          </div>
        </Form>
      </Container>
      
      <CustomSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        variant={snackbarVariant}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        onClose={handleCloseSnackbar}
      />
      {loading && <LoadingSpinner />} 
    </div>
  );
}

export default Register;

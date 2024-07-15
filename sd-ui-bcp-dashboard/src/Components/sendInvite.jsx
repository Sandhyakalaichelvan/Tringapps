import React, { useState, useEffect } from 'react';
import { Container, Button, Form } from 'react-bootstrap';
import { TextField, Select, MenuItem, FormControl, InputLabel, FormHelperText } from '@mui/material';
import '../styles/sendInvite.css';
import { PortURL } from './Config';
import LoadingSpinner from './LoadingSpinner'; 
import axios from 'axios';

function SendInvite({ onClose }) {
  const initialFormData = {
    email: '',
    role: '',
    organization: ''
  };

  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [roleError, setRoleError] = useState('');
  const [orgError, setOrgError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [organizations, setOrganizations] = useState([]);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    // Fetch organizations and roles when the component mounts
    fetchOrganizations();
    fetchRoles();
  }, []);

  const fetchOrganizations = async () => {
    try {
      const response = await axios.get(`${PortURL}/Get-Org`);
      setOrganizations(response.data);
    } catch (error) {
      console.error('Error fetching organizations:', error);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await axios.get(`${PortURL}/Get-Role`);
      setRoles(response.data);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
    if (name === 'email') {
      setEmailError('');
    }
    if (name === 'role') {
      setRoleError('');
    }
    if (name === 'organization') {
      setOrgError('');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true); 
  
    if (!formData.email.trim()) {
      setEmailError('Email is required');
      setLoading(false);
      return;
    }
  
    if (!formData.role.trim()) {
      setRoleError('Role is required');
      setLoading(false);
      return;
    }
  
    if (!formData.organization.trim()) {
      setOrgError('Organization is required');
      setLoading(false);
      return;
    }
  
    try {
      // Retrieve session ID and email from local storage
      const sessionId = localStorage.getItem('sessionId');
      const email = localStorage.getItem('email');
  
      const response = await fetch(`${PortURL}/send-invite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Session-ID': sessionId, 
          'Email': email 
        },
        body: JSON.stringify(formData)
      });
  
      if (response.ok) {
        setSuccessMessage('Invitation sent successfully');
        setFormData(initialFormData); 
        setTimeout(() => {
          onClose();
        }, 3000);
      } else {
        const errorData = await response.json(); 
        if (errorData.message === 'user already exists') {
          setSuccessMessage('User already exists'); // Display user-friendly message
        } else {
          setError(errorData.message); // Display other errors
          setTimeout(() => {
            setError('');
          }, 3000); 
        }
      }      
  
    } catch (error) {
      console.error('Error sending invitation:', error);
    }
  
    setLoading(false);
  };
  
  
  return (
    <div className="form d-flex justify-content-center align-items-center">
      <Container className="mt-6 p-4 shadow bg-body">
      <span className="close-SendInvite" onClick={onClose}>✖</span>
        <h6 className="text-center mb-4 mt-1 ">Send Invite</h6>
        {successMessage && (
        <div className="text-success mb-3">{successMessage}</div>
        )}
        {!successMessage && (
        <div className="text-danger mb-3">{error}</div>
        )}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formBasicEmail" className="mb-3">
            <TextField
              className="label"
              type="text"
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              size="small"
              error={!!emailError}
              helperText={emailError}
            />
          </Form.Group>
          <Form.Group controlId="formBasicRole" className="mb-3">
            <FormControl fullWidth size="small" error={!!roleError}>
              <InputLabel id="role-select">Role</InputLabel>
              <Select
                labelId="role-select"
                name="role"
                label="Role"
                value={formData.role}
                onChange={handleChange}
              >
                {roles.map(role => (
                  <MenuItem key={role.role_ID} value={role.role}>{role.role}</MenuItem>
                ))}
              </Select>
              <FormHelperText>{roleError}</FormHelperText>
            </FormControl>
          </Form.Group>
          <Form.Group controlId="formBasicOrganization" className="mb-3">
            <FormControl fullWidth size="small" error={!!orgError}>
              <InputLabel id="organization-select">Portfolio Company</InputLabel>
              <Select
                labelId="organization-select"
                name="organization"
                label="Portfolio Company"
                value={formData.organization}
                onChange={handleChange}
              >
                {organizations.map(org => (
                  <MenuItem key={org.org_ID} value={org.org_name}>{org.org_name}</MenuItem>
                ))}
              </Select>
              <FormHelperText>{orgError}</FormHelperText>
            </FormControl>
          </Form.Group>
          <Button type="submit" className="btn btn-success rounded-pill w-100 submit">Submit</Button>
        </Form>
      </Container>
      {loading && <LoadingSpinner />}
    </div>
  );
};

export default SendInvite;

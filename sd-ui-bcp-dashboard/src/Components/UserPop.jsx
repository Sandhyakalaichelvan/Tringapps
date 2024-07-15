import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSave, faBan, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { PortURL } from "./Config";
import '../styles/UserPop.css';
import ConfirmationModal from  './ConfirmationModal';

const UserPop = ({ handleClose }) => {
  const [excelData, setExcelData] = useState([]);
  const [editedRowId, setEditedRowId] = useState(null);
  const [editedRole, setEditedRole] = useState(null);
  const [roles, setRoles] = useState([]);
  const [deactivatedRows, setDeactivatedRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editSuccess, setEditSuccess] = useState(false);
  const [deactivateSuccess, setDeactivateSuccess] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [rowToDeactivate, setRowToDeactivate] = useState(null);

  useEffect(() => {
    fetchData();
    fetchRoles();
  }, []);


 
  
  const fetchData = async () => {
    try {
      const response = await fetch(`${PortURL}/users`);
      if (response.ok) {
        const data = await response.json();
        setExcelData(data);
      } else {
        console.error('Failed to fetch Excel data:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching Excel data:', error);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await fetch(`${PortURL}/Get-Role`);
      if (response.ok) {
        const data = await response.json();
        setRoles(data);
      } else {
        console.error('Failed to fetch roles:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const handleEdit = async (index) => {
    try {
      if (!deactivatedRows.includes(index)) {
        const response = await fetch(`${PortURL}/Get-Role`);
        if (response.ok) {
          const data = await response.json();
          setRoles(data);
        } else {
          console.error('Failed to fetch roles:', response.statusText);
        }

        setEditedRowId(index);
        const selectedRole = excelData[index].Role.trim() ? excelData[index].Role : null;
        setEditedRole(selectedRole);
      } else {
        console.log('Row is deactivated. Cannot edit.');
      }
    } catch (error) {
      console.error('Error editing row:', error);
    }
  };

  const handleRoleChange = (event) => {
    const selectedRole = event.target.value;
    setEditedRole(selectedRole);
  };

  const handleSave = async () => {
    try {
      if (editedRowId !== null) {
        const updatedData = [...excelData];
        updatedData[editedRowId].Role = editedRole;
  
        const {  Email } = updatedData[editedRowId];
  
        const response = await fetch(`${PortURL}/Updateuser`, {
          method: 'POST',
          body: JSON.stringify({  email:Email,Role: editedRole}),
          headers: {
            'Content-Type': 'application/json',
            'Session-ID': localStorage.getItem('sessionId'),
            'Email': Email
          }
        });
  
        if (response.ok) {
          console.log('Role updated successfully');
          setEditSuccess(true);
          // const responseData = await response.json();
        } else {
          console.error('Failed to update role:', response.statusText);
        }
  
        setExcelData(updatedData);
        setEditedRowId(null);
      } else {
        console.log('No row is currently being edited.');
      }
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const handleDeactivate = async (index) => {
    try {
      const isActive = excelData[index].isActive;

      if (isActive) {
        setRowToDeactivate(index);
        setShowConfirmationModal(true);
        
      } else {
        console.log('User is already deactivated.');
      }
    } catch (error) {
      console.error('Error deactivating user:', error);
    }
  };

  const confirmDeactivation = async () => {
    try {
      const index = rowToDeactivate;
      const email = excelData[index].Email; 

      const response = await fetch(`${PortURL}/user-Active`, {
        method: 'PUT',
        body: JSON.stringify({ isActive: 0, email }), 
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        console.log('User deactivated successfully');
        setDeactivateSuccess(1);
        const updatedData = [...excelData];
        updatedData[index].isActive = 0;
        setExcelData(updatedData);
        setDeactivatedRows([...deactivatedRows, index]);
      } else {
        console.error('Failed to deactivate user:', response.statusText);
      }
    } catch (error) {
      console.error('Error deactivating user:', error);
    }

    setShowConfirmationModal(false);
    setRowToDeactivate(null);
  };

  

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredData = excelData.filter((row) => {
    const values = Object.values(row).join('').toLowerCase();
    return values.includes(searchQuery.toLowerCase());
  });

  const columnNames = ['Username', 'Company', 'Email', 'Role', 'isActive'];

  return (
    <Container fluid className="mt-10">
    <Row className="row Render-Row1">
    
    <>
    <ConfirmationModal
          show={showConfirmationModal}
          onHide={() => setShowConfirmationModal(false)}
          onConfirm={confirmDeactivation}
          title="Confirm Deactivate"
          cancelText="No"
          confirmText="Yes"
          cancelVariant="secondary"
          confirmVariant="danger"
          message={`Are you sure you want to Deactivate the User?`}
        />
    </>
           <div className='close-user'>
        <span className="close-Users" onClick={handleClose}>✖</span>
        </div>
      <Col className="col col1 Render-Col">
        {editSuccess && (
          <div className="success-message">Edit successful!</div>
        )}
        {deactivateSuccess && (
          <div className="success-message">Deactivated successfully!</div>
        )}
       
        <br></br>
        <div className='User'>
          <h4>USERS</h4>
          <input type="text" placeholder="Search..." className='Usersearch' value={searchQuery} onChange={handleSearch} />
        </div>
      
        <div className="table-container" style={{  height: '500px' }}>
          {filteredData.length === 0 ? (
            <div className="no-data-message" >No data available</div>
          ) : (
            <table striped="true" bordered="true" className='grid'>
              <thead className="sticky-header">
                <tr>
                {Object.keys(excelData[0] || {}).map((key, index) => (
                  <th key={index}>{columnNames[index]}</th>
                ))}
                  <th className="action-cell">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((row, index) => (
                  <tr key={index} className={row.isActive === 0 ? 'deactivated-row' : ''}>
                    {Object.keys(row).map((key, i) => (
                      <td key={i}>
                        {editedRowId === index && key === 'Role' ? (
                          <select  className="Role" value={editedRole || ''} onChange={handleRoleChange} style={{ color: 'black' }}>
                            {roles.length > 0 && roles.map(role => (
                              <option key={role.role_ID} value={role.role}>{role.role}</option>
                            ))}
                          </select>
                        ) : (
                          row[key]
                        )}
                      </td>
                    ))}
                    <td className="action-cell">
                      {editedRowId === index ? (
                        <div className="action-buttons">
                          <button className="btn btn-sm " onClick={handleSave}>
                            <FontAwesomeIcon icon={faSave} />
                          </button>
                          <button className="btn btn-sm Cancel" onClick={() => setEditedRowId(null)}>
                            <FontAwesomeIcon icon={faTimesCircle} />
                          </button>
                        </div>
                      ) : (
                        <div className="action-buttons">
                          <button className="btn btn-sm Edit" onClick={() => handleEdit(index)} disabled={row.isActive === 0}>
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                          <button className="btn btn-sm Deactivate" onClick={() => handleDeactivate(index)}>
                            <FontAwesomeIcon icon={faBan} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      
      </Col>
    </Row>
  </Container>
  );
};

export default UserPop;

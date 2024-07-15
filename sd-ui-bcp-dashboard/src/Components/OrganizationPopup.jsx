import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSave, faTimesCircle, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'; // Import the trash icon
import { PortURL } from "./Config";
import '../styles/ExcelGrid.css'; // Assuming you have a CSS file for styling
import '../styles/OrgPopup.css'; // Assuming you have a CSS file for styling


const OrgPop = ({ handleClose }) => {
  const [excelData, setExcelData] = useState([]);
  const [editedRowIndex, setEditedRowIndex] = useState(null);
  const [editedOrgName, setEditedOrgName] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [addMode, setAddMode] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(`${PortURL}/Get-Org`);
      if (response.ok) {
        const data = await response.json();
        setExcelData(data);
        console.log("ORgDate",data);
      } else {
        console.error('Failed to fetch Excel data:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching Excel data:', error);
    }
  };

  const handleEdit = (index) => {
    setEditedRowIndex(index);
    setEditedOrgName(excelData[index].org_name);
  };

  const handleInputChange = (event) => {
    setEditedOrgName(event.target.value);
  };

  const handleSave = async () => {
    try {
      const updatedData = [...excelData];
      updatedData[editedRowIndex].org_name = editedOrgName;

      const response = await fetch(`${PortURL}/update-org`, {
        method: 'PUT',
        body: JSON.stringify({ org_id: updatedData[editedRowIndex].org_ID, new_org_name: editedOrgName }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setErrorMessage(false);
        setSuccessMessage('Portfolio Company updated successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        console.error('Failed to update Portfolio Company:', response.statusText);
      }

      setExcelData(updatedData);
      setEditedRowIndex(null);
      setEditedOrgName('');
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const handleAddRow = () => {
    setAddMode(true);
    setEditedOrgName('');
    setEditedRowIndex(null);
  };

  const handleSaveNewOrg = async () => {
    try {
      const response = await fetch(`${PortURL}/create-org`, {
        method: 'POST',
        body: JSON.stringify({ org_name: editedOrgName }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        console.log('New Portfolio Company created successfully');
        setErrorMessage(false);
        setSuccessMessage('New Portfolio Company created successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
        fetchData();
      } else {
        console.error('Failed to create new Portfolio Company:', response.statusText);
      }

      setAddMode(false);
      setEditedOrgName('');
    } catch (error) {
      console.error('Error saving new Portfolio Company:', error);
    }
  };

  const handleDeleteRow = async (index) => {
    try {
      const orgIDToDelete = excelData[index].org_ID;
      const response = await fetch(`${PortURL}/delete-Org`, {
        method: 'DELETE',
        body: JSON.stringify({ org_ID: orgIDToDelete }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      if (response.ok) {
        setErrorMessage(false);
        setSuccessMessage(true);
        setSuccessMessage('Portfolio Company Deleted Successfully')
        setTimeout(() => setSuccessMessage(''), 3000);
        fetchData();
      } else if (response.status === 409) {

        setSuccessMessage(false);
        setErrorMessage(true);
        setErrorMessage('Deletion Unsuccessful: Something went wrong!');
        setTimeout(() => setErrorMessage(''), 3000);
        // console.error('Failed to delete Portfolio Company:', response.statusText);
      } else {
        // Handle other error statuses
        setSuccessMessage(false);
        setErrorMessage(true);
        setErrorMessage('Deletion Unsuccessful: Something went wrong!');
        setTimeout(() => setErrorMessage(''), 3000);
        // console.error('Failed to delete Portfolio Company:', response.statusText);
      }
    } catch (error) {
      // Handle network errors or other exceptions
      setSuccessMessage(false);
      setErrorMessage(true);
      setErrorMessage('Deletion Unsuccessful: Something went wrong!');
      // console.error('Error deleting Portfolio Company:', error);
    }
  };

  return (
    <Container fluid className=" mt-10">
        <Row className="row Render-Row1">
      <Col className="col col1 Render-Col">
        <div className='closeIcon'>
          <span className="close-org" onClick={handleClose}>✖</span>
        </div>
        <br></br>
        <div className='OrgHead'>
          <h4>Portfolio Companies</h4>
          <button className="btn btn-sm Add" onClick={handleAddRow}>
            <FontAwesomeIcon icon={faPlus} /> Add New
          </button>
        </div>
        <div className="message-container">
          {successMessage && <div className="success-message">{successMessage}</div>}
          {errorMessage && <div className="error-message">{errorMessage}</div>}
        </div>
        <div className="Org-pop-container table-container">
         

          <Table striped bordered hover >
            <thead className="sticky-header">
              <tr>
                <th className={'org-name-header sticky-header company-header'}>Company Name</th> 

                <th className='action-headers'>Action</th> 
              </tr>
            </thead>
              <tbody>
              {addMode && (
  <tr>
    <td>
      <input
        type="text"
        className='addCompany'
        placeholder="New Portfolio"
        value={editedOrgName}
        onChange={handleInputChange}
      />
    </td>
    <td>
      <div className='editSave action-buttons'>
        <div onClick={handleSaveNewOrg}>
          <FontAwesomeIcon icon={faSave} />
        </div>
        <div onClick={() => setAddMode(false)}>
          <FontAwesomeIcon icon={faTimesCircle} />
        </div>
      </div>
    </td>
  </tr>
)}
{excelData.map((row, index) => (
  <tr key={index}>
    <td>
      {editedRowIndex === index && row.org_name ? (
        <input
          type="text"
          className='OrgIn'
          value={editedOrgName}
          onChange={handleInputChange}
        />
      ) : (
        <span className='Usercount'>
          <div className='orgname'>{row.org_name}</div>
          <div className='slash'>|</div>
            <div className='count'>{row.user_count}  users</div>
       
        </span>
      )}
    </td>
    <td>
      {editedRowIndex === index && !addMode ? (
        <div className='editSave '>
          <div onClick={handleSave}>
            <FontAwesomeIcon icon={faSave} />
          </div>
          <div onClick={() => setEditedRowIndex(null)}>
            <FontAwesomeIcon icon={faTimesCircle} />
          </div>
        </div>
      ) : (
        <div className='d-flex editSave '>
          <div className="btn-sm Edit" onClick={() => handleEdit(index)}>
            <FontAwesomeIcon icon={faEdit} />
          </div>
          <div className="btn-sm Delete" onClick={() => handleDeleteRow(index)}> 
            <FontAwesomeIcon icon={faTrash} />
          </div>
        </div>
      )}
    </td>
  </tr>
))}
              
              </tbody>
            </Table>
          </div>
          {/* <div>
            <button className="btn btn-sm Add" onClick={handleAddRow}>
              <FontAwesomeIcon icon={faPlus} /> Add Organization
            </button>
          </div> */}
        </Col>
      </Row>
    </Container>
  );
};

export default OrgPop;

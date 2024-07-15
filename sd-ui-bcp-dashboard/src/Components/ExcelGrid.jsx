/* eslint-disable eqeqeq */
  import React, { useState,useEffect } from 'react';
  import { Table } from 'react-bootstrap';
  import { Container, Row, Col } from 'react-bootstrap';
  import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
  import { faEdit, faSave, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
  import '../styles/dashboard.css';
  import '../styles/ExcelGrid.css';
  import {columnMap, reverseColumnMap} from "../Objects/Objects";
import { Key } from 'react-bootstrap-icons';



  
  const ExcelGrid = ({
    filteredData,
    selectedRowIds,
    editedRowId,
    editedRowData,
    setEditedRowData,
    handleEdit,
    handleCancel,
    handleInputChange,
    handleSave,
    handleDelete, 
    editedRow,
    rowToDelete,

    // formatDateCell,
    roleID // Pass Role_ID as a prop
  }) => {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  

    useEffect(() => {
    
      if (editedRowId !== null) {
        const editedRow = sortedData()[editedRowId];
        if (editedRow) {
          setEditedRowData(editedRow);
        }
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sortConfig, editedRowId,rowToDelete]);
    
    // 
    const requestSort = (key) => {
      // Check if the key is one of the allowed columns for sorting
      if (Key) {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
          direction = 'descending';
        }
        
        setSortConfig({ key, direction });
      }
    };
    


    const sortedData = () => {
      if (sortConfig.key !== null) {
        const sorted = [...filteredData].sort((a, b) => {
          if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
          }
          if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
          }
          return 0;
        });
        return sorted;
      }
      return filteredData;
    };

  const formatMonthYear = (dateString) => {
    // Parse the date string into a Date object
    const date = new Date(dateString);
    // Add one minute to the date
    date.setMinutes(date.getMinutes() );
    // Extract month and year components
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear().toString().substr(-2);
    // Format the month and year into the desired format
    return `${month.toLocaleString()}-${year}`;
  };




  // const formatDateCell = (value, key) => {
  // if (key === "MonthYear") {
  // return formatMonthYear(value);
  // }
  // return value;
  // };


  const formatNumber = (number) => {
    if (!number) return ''; // Handle empty or null values

    // Convert the number to a string
    let formattedNumber = number.toString();

    // Split the number into integer and decimal parts
    const parts = formattedNumber.split('.');
    
    // Format the integer part with commas
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    // Join the integer and decimal parts with a period
    formattedNumber = parts.join('.');

    return formattedNumber;
  };

//   const formatDateForInput = (dateString) => {
//     if (!dateString) return ''; // Handle empty or null values
//     const date = new Date(dateString);
//     const year = date.getFullYear();
//     let month = (date.getMonth() + 1).toString().padStart(2, '0');
//     let day = date.getDate().toString().padStart(2, '0');
//     return `${year}-${month}-${day}`;
// };
  const reversedColumnMap = reverseColumnMap(columnMap);

    return (
      <Container fluid className="mt-2">
        <Row className="row Render-Row">
          <Col className="col Render-Col">
            <div className="table-responsive render">
              <Table striped bordered hover>
                <thead className="sticky-header">
                  <tr>
                  {Object.keys(filteredData[0] || {}).map((key) => (
                      key !== 'ID' && // Exclude the 'id' column
                      <th key={key} onClick={() => requestSort(key)}>
                        {reversedColumnMap[key] || key}
                        {sortConfig.key === key && (
                          <span>{sortConfig.direction === 'ascending' ? ' ▲' : ' ▼'}</span>
                        )}
                      </th>
                    ))}
                    <th className="action-cell">Action</th>
                  </tr>
                </thead>
                <tbody>
                {sortedData().map((row, index) => (
    <tr key={index}>
      {Object.keys(row).map((key) => (
        key !== 'ID' && (
          <td key={key}>
            {editedRowId === index ? (
              (key === 'CompanyName') ? (
                <span>{editedRowData[key]}</span>
              ) : (
                key === 'MonthYear' ? (
                  <span>{formatMonthYear(row[key])}</span> // Render as plain text
                ) : (
                  <input
                    type="text"
                    className='GridInput'
                    value={editedRowData[key] || ''}
                    onChange={(e) => handleInputChange(e, key)}
                  />
                )
              )
            ) : (
              <span>{key === 'MonthYear' ? formatMonthYear(row[key]) : formatNumber(row[key])}</span>
            )}
          </td>

                                                      )
                          ))}
                      <td className="action-cell">
                      {roleID == 1 || roleID == 2 ? (
                        <>
                          {editedRowId === index ? (
                            <div className="action-buttons">
                              <button
                                className="btn btn-sm Save"
                                onClick={() => handleSave()}
                              >
                                <FontAwesomeIcon icon={faSave} />
                              </button>
                              <button
                                className="btn btn-sm Cancel"
                                onClick={() => handleCancel()}
                              >
                                <FontAwesomeIcon icon={faTimes} />
                              </button>
                            </div>
                          ) : (
                            <div className="action-buttons">
                              <button
                                className="btn btn-sm Edit"
                                onClick={() => handleEdit(index,row.ID)}
                              >
                                <FontAwesomeIcon icon={faEdit} />
                              </button>
                              <button
                                className="btn btn-sm Delete"
                                onClick={() => handleDelete(index,row.ID)}
                              >
                                <FontAwesomeIcon icon={faTrash} />
                              </button>
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                        {editedRowId === index ? (
                          <div className="action-buttons">
                            <button
                              className="btn btn-sm Save"
                              onClick={() => handleSave()}
                            >
                              <FontAwesomeIcon icon={faSave} />
                            </button>
                            <button
                              className="btn btn-sm Cancel"
                              onClick={() => handleCancel()}
                            >
                              <FontAwesomeIcon icon={faTimes} />
                            </button>
                          </div>
                        ) : (
                          <div className="action-buttons">
                            <button
                              className="btn btn-sm Edit disabled" // Add disabled class
                              onClick={() => handleEdit(index)}
                            >
                              <FontAwesomeIcon icon={faEdit} className="blur-icon" /> {/* Apply blur to the icon */}
                            </button>
                            <button
                              className="btn btn-sm Delete disabled" // Add disabled class
                              onClick={() => handleDelete(index)}
                            >
                              <FontAwesomeIcon icon={faTrash} className="blur-icon" /> {/* Apply blur to the icon */}
                            </button>
                          </div>
                        )}

                      </>
                      )}
                    </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Col>
        </Row>
      </Container>
    );
  };

  export default ExcelGrid;

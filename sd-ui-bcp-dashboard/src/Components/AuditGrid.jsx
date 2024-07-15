import React, { useState, useEffect } from 'react';
import { Table, Form } from 'react-bootstrap';
import { Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { PortURL } from './Config';
import '../styles/dashboard.css';
import '../styles/ExcelGrid.css';

const AuditGrid = ({ handleClose }) => {
  const [auditData, setAuditData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'ModificationTime', direction: 'descending' });
  const [editedRowId] = useState(null);
  const [editedRowData, setEditedRowData] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterYear, setFilterYear] = useState('');

  useEffect(() => {
    fetchAuditData();
  }, []);

  useEffect(() => {
    applyFilters();
  },);

  const fetchAuditData = async () => {
    try {
      const response = await fetch(`${PortURL}/Audit/get`);
      const data = await response.json();
    //   console.log('Fetched audit data:', data);
      setAuditData(data.flat());
    } catch (error) {
      console.error('Error fetching audit data:', error);
    }
  };

 const applyFilters = () => {
  let filtered = [...auditData];

  if (searchTerm.trim() !== '') {
    filtered = filtered.filter((item) =>
      Object.values(item).some((value) =>
        value &&
        (value.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
          formatMonthYear(value).toLowerCase().includes(searchTerm.toLowerCase()))
      )
    );
  }

  if (filterYear!== '') {
    filtered = filtered.filter((item) => {
      const modificationTime = new Date(item.ModificationTime);
      const year = modificationTime.getFullYear();
      return year === parseInt(filterYear);
    });
  }
  setFilteredData(filtered);
};

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
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
    const date = new Date(dateString);
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear().toString().substr(-2);
    return `${month}-${year}`;
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString('default', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatNumber = (number) => {
    if (!number) return '';
    let formattedNumber = number.toString();
    const parts = formattedNumber.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    formattedNumber = parts.join('.');
    return formattedNumber;
  };

  const auditColumnMap = {
    ModificationTime: 'Modified Time',
    ModifiedBy: 'Modified By',
    MonthYear: 'Month-Year',
    CompanyName: 'Company Name',
    RevenueActual: 'Revenue Actual',
    RevenueBudget: 'Revenue Budget',
    GrossProfitActual: 'Gross Profit Actual',
    GrossProfitBudget: 'Gross Profit Budget',
    SGAActual: 'SGA Actual',
    SGABudget: 'SGA Budget',
    EBITDAActual: 'EBITDA Actual',
    EBITDABudget: 'EBITDA Budget',
    CapExActual: 'CapEx Actual',
    CapExBudget: 'CapEx Budget',
    FixedAssetsNetActual: 'Fixed Assets Net Actual',
    FixedAssetsNetBudget: 'Fixed Assets Net Budget',
    CashActual: 'Cash Actual',
    CashBudget: 'Cash Budget',
    TotalDebtActual: 'Total Debt Actual',
    TotalDebtBudget: 'Total Debt Budget',
    AccountsReceivableActual: 'Accounts Receivable Actual',
    AccountsReceivableBudget: 'Accounts Receivable Budget',
    AccountsPayableActual: 'Accounts Payable Actual',
    AccountsPayableBudget: 'Accounts Payable Budget',
    InventoryActual: 'Inventory Actual',
    InventoryBudget: 'Inventory Budget',
    EmployeesActual: 'Employees Actual',
    EmployeesBudget: 'Employees Budget',
    Quarter: 'Quarter',
  };

  const renderTableHeaders = () => (
    <thead className="sticky-header">
      <tr>
      {Object.keys(auditColumnMap).map((key) => (
        key !== 'ID' && (
        <th key={key} onClick={() => requestSort(key)}>
            <span>{auditColumnMap[key]}</span>
        </th>
        )
       ))}
      </tr>
    </thead>
  );

  const renderTableBody = () => (
    <tbody>
    {sortedData().length === 0 ? (
    <div className="no-results-audit">
    <p className='text-result'>No results found</p>
    </div>     
    ) : (
      sortedData().map((row, index) => (
        <tr key={index}>
          {Object.keys(auditColumnMap).map((key) => (
            key !== 'ID' && (
              <td key={key} className={key === 'ModificationTime' || key === 'ModifiedBy' ? 'extra-space' : ''}>
                {renderCellContent(row, key, index)}
              </td>
            )
          ))}
        </tr>
      ))
    )}
  </tbody>
  );

  const renderCellContent = (row, key, index) => {
    if (editedRowId === index) {
      if (key === 'CompanyName') {
        return <span>{editedRowData[key]}</span>;
      } else if (key === 'MonthYear') {
        return <span>{formatMonthYear(row[key])}</span>;
      } else {
        return (
          <input
            type="text"
            className="GridInput"
            value={editedRowData[key] || ''}
            onChange={(e) => handleInputChange(e, key)}
          />
        );
      }
    } else {
      return (
        <span>
          {key === 'MonthYear' 
            ? formatMonthYear(row[key]) 
            : key === 'ModificationTime'
            ? formatDateTime(row[key])
            : formatNumber(row[key])
          }
        </span>
      );
    }
  };

  const handleInputChange = (e, key) => {
    const { value } = e.target;
    setEditedRowData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleYearFilter = (e) => {
    const selectedYear = e.target.value;
    setFilterYear(selectedYear);
  };

  return (
    <Container fluid className="audit-grid-container">
      <Row className="header-container justify-content-between align-items-center">
        <Col>
          <h4>Audit Data</h4>
        </Col>
        <Col className="text-right">
          <div className="close-audit" onClick={handleClose}>
            <FontAwesomeIcon icon={faTimes} />
          </div>
        </Col>
      </Row>
      <Container fluid className="container-fluid mt-2">
      <Row className="filter-container justify-content-between">
        <Col md={6} className="search-bar-audit">
          <Form.Control
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </Col>
        <Col md={3} className="year-filter-audit">
        <Form.Control as="select" value={filterYear} onChange={handleYearFilter}>
            <option value="">Select Year</option>
            {Array.from(new Set(auditData.map((item) => {
            const modificationTime = new Date(item.ModificationTime);
            return modificationTime.getFullYear();
            }))).map((year) => (
            <option key={year} value={year}>{year}</option>
            ))}
        </Form.Control>
        <FontAwesomeIcon icon={faCaretDown} className="dropdown-icon-audit" />
        </Col>
      </Row>  
      </Container>  
      <Row className="table-audit">
        <Col>
          <Table striped bordered hover>
            {renderTableHeaders()}
            {renderTableBody()}
          </Table>
        </Col>
      </Row>
    </Container>
  );
};

export default AuditGrid;

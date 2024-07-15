
import React from 'react';
import { Navbar, Nav, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import PopUpContainer from "./popup";
import "../styles/NavBar.css";

const NavbarComponent = ({ username, handleLogout, isMobile }) => {
  const role = localStorage.getItem('role');

  return (
    <Navbar bg="light" expand="lg" className="w-100">
      <Link to="/dashboard" className="brand-wrapper">
        <div className="customNavbarBrand"></div>
      </Link>
      <Navbar.Toggle aria-controls="" />
      <Navbar.Collapse id="">
        <Nav className="ml-auto">
          {isMobile ? (
            <Dropdown className=''>
              <Dropdown.Toggle
                id="dropdown-basic"
                as="div"
                className="customDropdown"
              >
                <div className='access-container'>
                  <div className="username-container">
                    {username}
                  </div>
                  {role !== 'Restricted-User' && (
                    <div className="role-container">
                      ({role})
                    </div>
                  )}
                </div>
                <FontAwesomeIcon className="username" icon={faUser} />
              </Dropdown.Toggle>

              <Dropdown.Menu className='Menu'>
                <PopUpContainer></PopUpContainer>
                <div className="dropdown-item-hover text" onClick={handleLogout}>Logout</div>
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            <React.Fragment>
              <div className="smallscreen">
                <div className="ml-auto user">
                  <FontAwesomeIcon className='icon' icon={faUser} />{username} 
                </div>
                {role !== 'Restricted-User' && (
                  <div className="ml-auto role">
                    ({role})
                  </div>
                )}
                <PopUpContainer />
                <Dropdown.Item onClick={handleLogout} className="logout text">
                  Logout
                </Dropdown.Item>
              </div>
            </React.Fragment>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavbarComponent;

import React from 'react';
import { Container } from 'react-bootstrap';
import '../styles/Guide.css';

function Guide({ handleClose }) {
    return (
        <div className="form d-flex justify-content-center align-items-center">
            <Container className="guide shadow bg-body">
                <span className="close-guide" onClick={handleClose}>✖</span>
                <h3 className="mb-4 mt-1">Application Guide</h3>
                
                <div className="guide-content">
                    <div className="guide-section">
                        <h5>1. Getting Started</h5>
                        <br />
                        <h6>This application enables you to upload Excel files for efficient management of data.</h6>
                        <img src="/images/dashboard.png" alt="Getting Started" className="img-fluid" />
                    </div>

                    <div className="guide-section mt-4">
                    <h5>2. Features Overview</h5>
                    <br />
                    <h6>This application offers a variety of features tailored to different user roles:</h6>
                    <ul>
                        <li><strong>Admin:</strong> Access to all features</li>
                        <ul>
                            <li>Reset Password</li>
                            <li>Send Invite</li>
                            <li>Portfolio Companies</li>
                            <li>Users</li>
                            <li>Audit History</li>
                            <li>Logout</li>
                        </ul>
                        <img src="/images/admin.png" alt="Features Overview" className="img-fluid" />
                        <li><strong>Superuser:</strong> Limited features</li>
                        <ul>
                            <li>Reset Password</li>
                            <li>Logout</li>
                        </ul>
                        <img src="/images/superuser.png" alt="Features Overview" className="img-fluid" />
                        <li><strong>Restricted User:</strong> Minimal features</li>
                        <ul>
                            <li>Reset Password</li>
                            <li>Logout</li>
                        </ul>
                        <img src="/images/res-user.png" alt="Features Overview" className="img-fluid" />
                    </ul>      
                    </div>

                    <div className="guide-section mt-4">
                        <h6>3. How to Use</h6>
                        <img src="path/to/image3.jpg" alt="How to Use" className="img-fluid" />
                    </div>
                </div>
            </Container>
        </div>
    );
}

export default Guide;

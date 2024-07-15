import React, { useState, useEffect } from 'react';
import ResetNewPassword from './resetNewPassword';
import SendInvite from './sendInvite';
import OrganizationPopup from './OrganizationPopup';
import UserPop from './UserPop';
import AuditGrid from './AuditGrid';
import Guide from './Guide';
import '../styles/popup.css';

const PopUpContainer = () => {
  const [roleID, setRoleID] = useState(null);
  const [showGuide, setShowGuide] = useState(false);
  const [showAuditGrid, setShowAuditGrid] = useState(false);
  const [showResetPopup, setShowResetPopup] = useState(false);
  const [showInvitePopup, setShowInvitePopup] = useState(false);
  const [showOrganizationPopup, setShowOrganizationPopup] = useState(false);
  const [showUserPopup, setShowUserPopup] = useState(false);

  // Fetch roleID from localStorage when component mounts
  useEffect(() => {
    const storedRoleID = localStorage.getItem('Role_ID');
    setRoleID(storedRoleID);
  }, []);

  const handleResetPopupToggle = () => {
    setShowResetPopup(!showResetPopup);
    setShowInvitePopup(false);
    setShowOrganizationPopup(false);
    setShowUserPopup(false);
    setShowAuditGrid(false);
    setShowAuditGrid(false);
  };

  const handleInvitePopupToggle = () => {
    setShowInvitePopup(!showInvitePopup);
    setShowResetPopup(false);
    setShowOrganizationPopup(false);
    setShowUserPopup(false);
    setShowAuditGrid(false);
    setShowAuditGrid(false);
  };

  const handleOrganizationPopupToggle = () => {
    setShowOrganizationPopup(!showOrganizationPopup);
    setShowUserPopup(false);
    setShowResetPopup(false);
    setShowInvitePopup(false);
    setShowAuditGrid(false);
    setShowAuditGrid(false);
  };

  const handleUserPopupToggle = () => {
    setShowUserPopup(!showUserPopup);
    setShowOrganizationPopup(false);
    setShowResetPopup(false);
    setShowInvitePopup(false);
    setShowAuditGrid(false);
    setShowAuditGrid(false);
  };

  const handleAuditPopupToggle = () => {
    setShowAuditGrid(!showAuditGrid);
    setShowUserPopup(false);
    setShowOrganizationPopup(false);
    setShowResetPopup(false);
    setShowInvitePopup(false);
    setShowGuide(false);
  };

  const handleGuidePopupToggle = () => {
    setShowGuide(!showGuide);
    setShowUserPopup(false);
    setShowOrganizationPopup(false);
    setShowResetPopup(false);
    setShowInvitePopup(false);
    setShowAuditGrid(false);
};

  const handleClosePopups = () => {
    setShowResetPopup(false);
    setShowInvitePopup(false);
    setShowOrganizationPopup(false);
    setShowUserPopup(false);
    setShowAuditGrid(false);
    setShowGuide(false);
  };

  const handleResetSuccess = () => {
    setShowResetPopup(false);
  };

  const handleInviteSuccess = () => {
    setShowInvitePopup(false); 
  };

  if (!roleID) {
    return <div>Loading...</div>; // Add loading indicator if roleID is not available yet
  }

  return (
    <div className='text'>
      <div className="dropdown-item-hover border-text" onClick={handleResetPopupToggle}>Reset Password</div>

      {/* Conditionally render based on roleID */}
      {roleID === '1' && (
        <>
          <div className="dropdown-item-hover" onClick={handleInvitePopupToggle}>Send Invite</div>
          <div className="dropdown-item-hover" onClick={handleOrganizationPopupToggle}>Portfolio Company</div>
          <div className="dropdown-item-hover" onClick={handleUserPopupToggle}>Users</div>
          <div className="dropdown-item-hover" onClick={handleAuditPopupToggle}>Audit History</div>
          <div className="dropdown-item-hover" onClick={handleGuidePopupToggle}>BCP Guide</div>
        </>
      )}

      {/* Render popups based on roleID */}
      {(showResetPopup || showInvitePopup || showOrganizationPopup || showUserPopup || showAuditGrid || showGuide) && (
        <div className="popup-container backdrop">
          <div className="popup-inner" onClick={(e) => e.stopPropagation()}>
            {showResetPopup && <ResetNewPassword onClose={handleResetSuccess} />}
            {(showInvitePopup && roleID === '1') && <SendInvite onClose={handleInviteSuccess} />}
            {(showOrganizationPopup && roleID === '1') && <OrganizationPopup className="Organisation" handleClose={handleClosePopups} />}
            {(showUserPopup && roleID === '1') && <UserPop handleClose={handleClosePopups} />}
            {(showAuditGrid && roleID === '1') && <AuditGrid handleClose={handleClosePopups} />}
            {(showGuide && roleID === '1') && <Guide handleClose={handleClosePopups} />}
          </div>
        </div>
      )}
    </div>
  );
};

export default PopUpContainer;

import React from 'react';

const BusinessModal = ({ onClose, children }) => {
  const modalStyles = {
    position: 'absolute',
    top: '20%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#fff',
    padding: '20px',
    zIndex: 100,
  };

  return (
    <div style={modalStyles}>
      {children}
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default BusinessModal;

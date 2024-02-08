import React from 'react';

const AdditionalInfo = ({ rowData, onHide, cellCoordinates }) => {
  // Dynamically calculate the position of the additional info div relative to the cell
  const additionalInfoStyle = {
    position: 'absolute',
    top: cellCoordinates ? cellCoordinates.top + cellCoordinates.height : 0, // Adjust top position relative to cell
    left: cellCoordinates ? cellCoordinates.left : 0, // Adjust left position relative to cell
    backgroundColor: 'white',
    padding: '10px',
    border: '1px solid black',
    zIndex: 9999, // Ensure the additional info appears above other content
  };

  return (
    <div style={additionalInfoStyle}>
      {/* Render additional information content based on rowData */}
      {/* For example: */}
      <h3>{rowData.title}</h3>
      <p>{rowData.description}</p>
      {/* Add more content as needed */}
      <button onClick={onHide}>Hide</button>
    </div>
  );
};

export default AdditionalInfo;

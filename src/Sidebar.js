import React from 'react';
import './Sidebar.css'; // Add custom CSS styles here

const Sidebar = ({ onVariableChange, onGeographyChange }) => {
  return (
    <div className="sidebar">
      <h2>Control Panel</h2>
      <div>
        <label>Select Variable:</label>
        <select onChange={onVariableChange}>
          <option value="">Alzheimers</option>
          <option value="">Food Insecurity</option>
          {/* Add more options here */}
        </select>
      </div>
      <div>
        <label>Select Geography:</label>
        <select onChange={onGeographyChange}>
          <option value="county">PUMA</option>
          <option value="county">County</option>
          <option value="county">Tract</option>
        </select>
      </div>
      {/* Add more controls as needed */}
    </div>
  );
};

export default Sidebar;
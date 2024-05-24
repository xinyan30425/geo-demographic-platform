import React from 'react';
import './Sidebar.css'; // Add custom CSS styles here

const Sidebar = ({ onVariableChange, onGeographyChange }) => {
  return (
    <div className="sidebar">
      <h2>Control Panel</h2>
      <div>
        <label>Select Health Estimates:</label>
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
      <div>
        <label>Select Gender:</label>
        <select onChange={onVariableChange}>
          <option value="">Female</option>
          <option value="">Male</option>
        </select>
      </div>
      <div>
        <label>Select Race:</label>
        <select onChange={onVariableChange}>
          <option value="">Hispanic</option>
          <option value="">Black</option>
          <option value="">White and the Other</option>
        </select>
      </div>
      <div>
        <label>Select Age Group:</label>
        <select onChange={onVariableChange}>
          <option value="">65-69</option>
          <option value="">70-74</option>
          <option value="">75-79</option>
          <option value="">80-84</option>
          <option value="">85+</option>
        </select>
      </div>
    </div>
  );
};

export default Sidebar;
import React from 'react';
import './Sidebar.css';

const Sidebar = ({ onVariableChange, onGeographyChange, onDemographicsChange }) => {
  return (
    <div className="sidebar">
      <h2>Control Panel</h2>
      <div>
        <label>Select Variable:</label>
        <select onChange={onVariableChange}>
          <option value="cognitiveDifficulty">Cognitive Difficulty</option>
          {/* Add more options here */}
        </select>
      </div>
      <div>
        <label>Select Geography:</label>
        <select onChange={onGeographyChange}>
          <option value="puma">PUMA</option>
          <option value="county">County</option>
          <option value="tract">Tract</option>
        </select>
      </div>
      <div>
        <label>Select Sex:</label>
        <select name="sex" onChange={onDemographicsChange}>
          <option value="all">All</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>
      <div>
        <label>Select Race:</label>
        <select name="race" onChange={onDemographicsChange}>
          <option value="all">All</option>
          <option value="white">White</option>
          <option value="black">Black</option>
          <option value="hispanic">Hispanic</option>
          <option value="asian">Asian</option>
        </select>
      </div>
      <div>
        <label>Select Age Group:</label>
        <select name="ageGroup" onChange={onDemographicsChange}>
          <option value="all">All</option>
          <option value="65-69">65-69</option>
          <option value="70-74">70-74</option>
          <option value="70-74">75-79</option>
          <option value="70-74">80-74</option>
          <option value="70-74">85+</option>

        </select>
      </div>
      <div>
        <label>Select Education:</label>
        <select name="education" onChange={onDemographicsChange}>
          <option value="all">All</option>
          <option value="less_than_high_school">Less than high school</option>
          <option value="high_school">High school</option>
          <option value="some_college">Some college</option>
          <option value="bachelors_or_higher">Bachelor's or higher</option>
        </select>
      </div>
    </div>
  );
};

export default Sidebar;

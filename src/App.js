import React, { useState, useEffect } from 'react';
import MapComponent from './MapComponent';
import Sidebar from './Sidebar';
import './App.css';

const App = () => {
  const [variable, setVariable] = useState('cognitiveDifficulty');
  const [geography, setGeography] = useState('puma');
  const [geoData, setGeoData] = useState(null);

  const handleVariableChange = (e) => {
    setVariable(e.target.value);
  };

  const handleGeographyChange = (e) => {
    setGeography(e.target.value);
  };

  return (
    <div className="app-container">
      <Sidebar onVariableChange={handleVariableChange} onGeographyChange={handleGeographyChange} />
      <MapComponent variable={variable} geography={geography} />
    </div>
  );
};

export default App;

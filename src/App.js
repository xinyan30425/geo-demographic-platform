// App.js
import React, { useState } from 'react';
import MapComponent from './MapComponent';
import Sidebar from './Sidebar';
import './App.css';

const App = () => {
  const [geography, setGeography] = useState('county');
  const [variable, setVariable] = useState('');

  const handleGeographyChange = (value) => {
    setGeography(value);
    console.log("Geography changed to:", value);
  };

  const handleVariableChange = (value) => {
    setVariable(value);
    console.log("Variable changed to:", value);
  };

  return (
    <div className="app-container">
      <Sidebar onGeographyChange={handleGeographyChange} onVariableChange={handleVariableChange} />
      <MapComponent geography={geography} variable={variable} />
    </div>
  );
};

export default App;

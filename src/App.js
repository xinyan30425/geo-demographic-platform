// App.js
import React, { useState } from 'react';
import MapComponent from './MapComponent';
import Sidebar from './Sidebar';
import './App.css';

const App = () => {
  const [geography, setGeography] = useState('county');
  const [variable, setVariable] = useState('');
  const [age, setAge] = useState('');
  const [sex, setSex] = useState('');
  const [race, setRace] = useState('');
  const [showDemographics, setShowDemographics] = useState(false);

  const handleGeographyChange = (value) => {
    setGeography(value);
    console.log("Geography changed to:", value);
  };

  const handleVariableChange = (value) => {
    setVariable(value);
    console.log("Variable changed to:", value);
  };

  const handleAgeChange = (value) => {
    setAge(value);
    console.log("Age changed to:", value);
  };

  const handleSexChange = (value) => {
    setSex(value);
    console.log("Sex changed to:", value);
  };

  const handleRaceChange = (value) => {
    setRace(value);
    console.log("Race changed to:", value);
  };

  const handleDemographicChange = (value) => {
    setShowDemographics(value);
    console.log("Show Demographics changed to:", value);
  };

  return (
    <div className="app-container">
      <Sidebar
        onGeographyChange={handleGeographyChange}
        onVariableChange={handleVariableChange}
        onAgeChange={handleAgeChange}
        onSexChange={handleSexChange}
        onRaceChange={handleRaceChange}
        onDemographicChange={handleDemographicChange}
      />
      <MapComponent
        geography={geography}
        variable={variable}
        age={showDemographics ? age : ''}
        sex={showDemographics ? sex : ''}
        race={showDemographics ? race : ''}
      />
    </div>
  );
};

export default App;

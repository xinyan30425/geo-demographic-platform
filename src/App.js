// App.js
import React, { useState } from 'react';
import MapComponent from './MapComponent';
import Sidebar from './Sidebar';
import './App.css';

const App = () => {
  const [geography, setGeography] = useState('county');

  const handleGeographyChange = (e) => {
    setGeography(e.target.value);
    console.log("Geography changed to:", e.target.value);
  };

  return (
    <div className="app-container">
      <Sidebar onGeographyChange={handleGeographyChange} />
      <MapComponent geography={geography} />
    </div>
  );
};

export default App;

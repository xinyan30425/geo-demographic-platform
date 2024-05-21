
import React, { useState, useEffect } from 'react';
import MapComponent from './MapComponent';
import Sidebar from './Sidebar';

const App = () => {
  const [variable, setVariable] = useState('cognitiveDifficulty');
  const [geography, setGeography] = useState('county');
  const [geoData, setGeoData] = useState(null);

  useEffect(() => {
    const fetchGeoData = async () => {
      try {
        const response = await fetch('/data/puma_newengland.geojson');
        const data = await response.json();
        setGeoData(data);
      } catch (error) {
        console.error('Error loading GeoJSON data:', error);
      }
    };

    fetchGeoData();
  }, []);

  const handleVariableChange = (e) => {
    setVariable(e.target.value);
  };

  const handleGeographyChange = (e) => {
    setGeography(e.target.value);
  };

  return (
    <div className="App" style={{ display: 'flex' }}>
      <Sidebar onVariableChange={handleVariableChange} onGeographyChange={handleGeographyChange} />
      <div style={{ flex: 1 }}>
        {geoData ? (
          <MapComponent geoData={geoData} variable={variable} geography={geography} />
        ) : (
          <div>Loading map...</div>
        )}
      </div>
    </div>
  );
};

export default App;

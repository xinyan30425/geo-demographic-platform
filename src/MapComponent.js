import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './MapComponent.css';
import Legend from './Legend';

const MapComponent = () => {
  const [geoData, setGeoData] = useState(null);
  const [mergedGeoData, setMergedGeoData] = useState(null);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [filters, setFilters] = useState({
    table: 'alzheimer_data',
    geoid: '',
    sex: '',
    race: '',
    education: '',
    ageg: ''
  });

  const fetchDataFromAPI = async () => {
    try {
      const query = new URLSearchParams(filters).toString();
      const url = `https://208bddka5j.execute-api.us-east-1.amazonaws.com/geodemo/data?${query}`;
      console.log("Fetching data from:", url);

      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
      }
      
      const data = await response.json();
      console.log("Data fetched from API:", data);
      return data;
    } catch (error) {
      console.error("Error fetching data from API:", error);
      throw error;
    }
  };

  const fetchGeoJSON = async () => {
    const geoJsonResponse = await fetch('/data/puma_newengland.geojson'); // puma GeoJSON
    if (!geoJsonResponse.ok) throw new Error('Failed to fetch GeoJSON data');
    const geoJson = await geoJsonResponse.json();
    return geoJson;
  };

  const mergeData = (geoJson, apiData) => {
    const mergedData = geoJson.features.map(feature => {
      const matchingApiData = apiData.find(row => row.geoid === feature.properties.GEOID10);
      if (matchingApiData) {
        feature.properties.alzheimer_prob = matchingApiData.alzheimer_prob;
      }
      return feature;
    });
    return { ...geoJson, features: mergedData };
  };

  const fetchAndMergeData = async () => {
    try {
      const geoJson = await fetchGeoJSON();
      const apiData = await fetchDataFromAPI();
      const mergedData = mergeData(geoJson, apiData);

      setGeoData(geoJson);
      setMergedGeoData(mergedData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  useEffect(() => {
    fetchAndMergeData();
  }, [filters]);

  useEffect(() => {
    console.log("cursorPosition.x", cursorPosition.x);
    console.log("cursorPosition.y", cursorPosition.y);
  }, [cursorPosition]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchDataFromAPI();
  };

  const styleFeature = feature => {
    return {
      fillColor: getColor(feature.properties.alzheimer_prob),
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
    };
  };

  const getColor = d => {
    return d > 10.5 ? '#800026' :
           d > 10 ? '#BD0026' :
           d > 9.5 ? '#E31A1C' :
           d > 9 ? '#FC4E2A' :
           d > 8.5 ? '#FD8D3C' :
           d > 8 ? '#FEB24C' :
                    '#FFEDA0';
  };

  const onEachFeature = (feature, layer) => {
    layer.on({
      click: (e) => {
        const map = e.target._map;
        const { lat, lng } = e.latlng;
        const point = map.latLngToContainerPoint([lat, lng]);
        const panelWidth = 100;
        const panelHeight = 100;

        let panelX = point.x;
        let panelY = point.y;

        const container = map.getContainer();
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;

        if (panelX + panelWidth > containerWidth) {
          panelX = containerWidth - panelWidth;
        }
        if (panelY + panelHeight > containerHeight) {
          panelY = containerHeight - panelHeight;
        }

        if (panelX < 0) {
          panelX = 0;
        }
        if (panelY < 0) {
          panelY = 0;
        }

        setCursorPosition({ x: panelX, y: panelY });
        setSelectedFeature(feature.properties);
      }
    });
  };

  if (!mergedGeoData) {
    return <div>Loading...</div>;
  }

  const bounds = [
    [15.0, -130.0], // Southwest corner
    [55.0, -60.0]   // Northeast corner
  ];

  return (
    <div className="map-container">
      <form onSubmit={handleSubmit} className="filter-form">
        <select name="table" onChange={handleInputChange}>
          <option value="alzheimer_data">Alzheimer Data</option>
          <option value="demographic_data">Demographic Data</option>
          {/* Add more options as needed */}
        </select>
        <input type="text" name="geoid" placeholder="GEOID" onChange={handleInputChange} />
        <input type="text" name="sex" placeholder="Sex" onChange={handleInputChange} />
        <input type="text" name="race" placeholder="Race" onChange={handleInputChange} />
        <input type="text" name="education" placeholder="Education" onChange={handleInputChange} />
        <input type="text" name="ageg" placeholder="Age Group" onChange={handleInputChange} />
        <button type="submit">Fetch Data</button>
      </form>

      <MapContainer
        bounds={bounds}
        minZoom={4}
        maxZoom={10}
        maxBounds={bounds}
        className="leaflet-map-container"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <GeoJSON data={mergedGeoData} style={styleFeature} onEachFeature={onEachFeature} />
        <Legend />
      </MapContainer>

      {selectedFeature && (
        <div 
          className="info-panel" 
          style={{ 
            top: cursorPosition.y, 
            left: cursorPosition.x, 
            position: 'absolute',
            transform: 'translate(-50%, -100%)'
          }}
        >
          <p>GEOID: {selectedFeature.GEOID || 'N/A'}</p>
          <p>PUMA: {selectedFeature.GEOID10 || 'N/A'}</p>
          <p>Alzheimer's Incidence Rate: {selectedFeature.alzheimer_prob ? `${selectedFeature.alzheimer_prob}%` : 'N/A'}</p>
        </div>
      )}
    </div>
  );
};

export default MapComponent;

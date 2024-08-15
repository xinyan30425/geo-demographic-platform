// MapComponent.js

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './MapComponent.css';
import Legend from './Legend';

const MapComponent = ({ variable, geography }) => {
  const [geoData, setGeoData] = useState(null);
  const [mergedGeoData, setMergedGeoData] = useState(null);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch GeoJSON data from the backend
        const geoJsonResponse = await fetch('http://localhost:3001/geojson');
        if (!geoJsonResponse.ok) throw new Error('Failed to fetch GeoJSON data');
        const geoJson = await geoJsonResponse.json();
        setGeoData(geoJson);

        // Fetch CSV data from the backend
        const csvResponse = await fetch('http://localhost:3001/csvdata');
        if (!csvResponse.ok) throw new Error('Failed to fetch CSV data');
        const csvData = await csvResponse.json();

        // Merge CSV data with GeoJSON data
        const mergedData = geoJson.features.map(feature => {
          const matchingCsvData = csvData.find(row => row.geoid === feature.properties.GEOID10);
          if (matchingCsvData) {
            feature.properties.percentage = matchingCsvData.percentage;
          }
          return feature;
        });
        setMergedGeoData({ ...geoJson, features: mergedData });
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    fetchData();
  }, [variable, geography]);

  useEffect(() => {
    console.log("cursorPosition.x", cursorPosition.x);
    console.log("cursorPosition.y", cursorPosition.y);
  }, [cursorPosition]);

  const styleFeature = feature => {
    return {
      fillColor: getColor(feature.properties.percentage),
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
        const panelWidth = 100; // Width of the info panel
        const panelHeight = 100; // Height of the info panel
        let panelX = point.x;
        let panelY = point.y;

        // Get container dimensions
        const container = map.getContainer();
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;

        // Adjust position to prevent overflow
        if (panelX + panelWidth > containerWidth) {
          panelX = containerWidth - panelWidth;
        }
        if (panelY + panelHeight > containerHeight) {
          panelY = containerHeight - panelHeight;
        }

        // Ensure the panel doesn't go off the screen
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
          <p>GEOID: {selectedFeature.GEOID10 || 'N/A'}</p>
          <p>Alzheimer's Incidence Rate: {selectedFeature.percentage ? `${selectedFeature.percentage}%` : 'N/A'}</p>
        </div>
      )}
    </div>
  );
};

export default MapComponent;

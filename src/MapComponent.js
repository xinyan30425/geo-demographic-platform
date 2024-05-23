import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import Papa from 'papaparse';
import 'leaflet/dist/leaflet.css';
import './MapComponent.css';

const MapComponent = ({ variable, geography }) => {
  const [geoData, setGeoData] = useState(null);
  const [mergedGeoData, setMergedGeoData] = useState(null);
  const [selectedFeature, setSelectedFeature] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch GeoJSON data
        const geoJsonResponse = await fetch('/data/puma_newengland.geojson');
        if (!geoJsonResponse.ok) throw new Error('Failed to fetch GeoJSON data');
        const geoJson = await geoJsonResponse.json();
        setGeoData(geoJson);
        console.log('GeoJSON Data:', geoJson);

        // Fetch and parse CSV data
        const csvResponse = await fetch('/data/ACS_Maine_Puma_Level_Alzheimer_Estimates_withedu.csv');
        if (!csvResponse.ok) throw new Error('Failed to fetch CSV data');
        const csvText = await csvResponse.text();
        const csvData = Papa.parse(csvText, { header: true }).data;
        console.log('CSV Data:', csvData);

        // Convert GEOID fields to strings to ensure proper matching
        const processedCsvData = csvData.map(row => ({
          ...row,
          GEOID: row.GEOID.toString(),
          percentage: parseFloat(row.percentage)
        }));
        console.log('Processed CSV Data:', processedCsvData);

        // Merge CSV data with GeoJSON data
        const mergedData = geoJson.features.map(feature => {
          const matchingCsvData = processedCsvData.find(row => row.GEOID === feature.properties.GEOID10);
          if (matchingCsvData) {
            feature.properties.percentage = matchingCsvData.percentage;
          }
          return feature;
        });

        setMergedGeoData({ ...geoJson, features: mergedData });
        console.log('Merged GeoData:', mergedData);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    fetchData();
  }, [variable, geography]);

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
      click: () => {
        setSelectedFeature(feature.properties);
      }
    });
  };


  if (!mergedGeoData) {
    return <div>Loading...</div>;
  }

  // Define the bounds for the US area
  const bounds = [
    [24.396308, -125.0], // Southwest corner of the US
    [49.384358, -66.93457] // Northeast corner of the US
  ];

  return (
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


        {selectedFeature && (
          <div className="info-panel">
            <h2>Selected PUMA Information</h2>
            <p>GEOID: {selectedFeature.GEOID10 || 'N/A'}</p>
            <p>Alzheimer's Incidence Rate: {selectedFeature.percentage ? `${selectedFeature.percentage}%` : 'N/A'}</p>
          </div>
        )}

      </MapContainer>

  );
};

export default MapComponent;

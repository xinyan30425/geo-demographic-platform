import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import Papa from 'papaparse';
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
        // Fetch GeoJSON data
        //const geoJsonResponse = await fetch('/data/puma_newengland.geojson');//puma
        const geoJsonResponse = await fetch('/data/county_newengland.geojson')//county
        if (!geoJsonResponse.ok) throw new Error('Failed to fetch GeoJSON data');
        const geoJson = await geoJsonResponse.json();
        setGeoData(geoJson);
        // console.log('GeoJSON Data:', geoJson);

        // Fetch and parse CSV data
        // const csvResponse = await fetch('/data/ACS_New_England_Puma_Level_Alzheimer_Estimates_withedu.csv');//puma
        const csvResponse = await fetch('/data/New_England_County_Level_Alzheimer_Percentage_with_County.csv');//county
        if (!csvResponse.ok) throw new Error('Failed to fetch CSV data');
        const csvText = await csvResponse.text();
        const csvData = Papa.parse(csvText, { header: true }).data;
        // console.log('CSV Data:', csvData);

        // Convert GEOID fields to strings to ensure proper matching
        const processedCsvData = csvData.map(row => ({
          ...row,
          GEOID: row.GEOID.toString(),
          percentage: parseFloat(row.percentage)
        }));
        // console.log('Processed CSV Data:', processedCsvData);

        // Merge CSV data with GeoJSON data
        const mergedData = geoJson.features.map(feature => {
          //const matchingCsvData = processedCsvData.find(row => row.GEOID === feature.properties.GEOID10);//puma
          const matchingCsvData = processedCsvData.find(row => row.GEOID === feature.properties.GEOID);//county
          if (matchingCsvData) {
            feature.properties.percentage = matchingCsvData.percentage;
          }
          return feature;
        });

        setMergedGeoData({ ...geoJson, features: mergedData });
        // console.log('Merged GeoData:', mergedData);
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
        // const clickX = e.originalEvent.pageX;
        // const clickY = e.originalEvent.pageY;
        const map = e.target._map;
        const { lat, lng } = e.latlng;
        const point = map.latLngToContainerPoint([lat, lng]);
        const panelWidth = 100; // Width of the info panel
        const panelHeight = 100; // Height of the info panel

        // Calculate the position of the info panel
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
        console.log("panelX", panelX);
        console.log("panelY", panelY);
        setSelectedFeature(feature.properties);
      }
    });
  };

  if (!mergedGeoData) {
    return <div>Loading...</div>;
  }

  // Define the bounds for the US area
  // const bounds = [
  //   [24.396308, -125.0], // Southwest corner of the US
  //   [49.384358, -66.93457] // Northeast corner of the US
  // ];
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

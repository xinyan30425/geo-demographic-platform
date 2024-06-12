import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import Papa from 'papaparse';
import 'leaflet/dist/leaflet.css';
import './MapComponent.css';
import Legend from './Legend';

const MapComponent = ({ geography }) => {
  const [geoData, setGeoData] = useState(null);
  const [mergedGeoData, setMergedGeoData] = useState(null);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [showCursor, setShowCursor] = useState(false);

  useEffect(() => {
    console.log("Fetching data for geography:", geography);

    const fetchData = async () => {
      try {
        let geoJsonPath, csvPath, processedCsvData, mergedData;
        let geoJson;

        if (geography === 'puma') {
          geoJsonPath = '/data/puma_maine.geojson';
          csvPath = '/data/ACS_Maine_Puma_Level_Alzheimer_Estimates_withedu.csv';
        } else if (geography === 'county') {
          geoJsonPath = '/data/modified_county_maine.geojson';
          csvPath = '/data/NCHS_Maine_County_Level_Alzheimer_Estimates.csv';
        } else if (geography === 'tract') {
          geoJsonPath = '/data/tract_maine.geojson';
          csvPath = '/data/tract_maine_alzheimer_probabilities_withoutedu.csv';
        }

        console.log(`GeoJSON Path: ${geoJsonPath}, CSV Path: ${csvPath}`);

        const [geoJsonResponse, csvResponse] = await Promise.all([
          fetch(geoJsonPath),
          fetch(csvPath)
        ]);

        if (!geoJsonResponse.ok) {
          throw new Error(`Failed to fetch GeoJSON data from ${geoJsonPath}`);
        }

        if (!csvResponse.ok) {
          throw new Error(`Failed to fetch CSV data from ${csvPath}`);
        }

        geoJson = await geoJsonResponse.json();
        const csvText = await csvResponse.text();
        const csvData = Papa.parse(csvText, { header: true }).data;

        console.log(`${geography.toUpperCase()} CSV Data:`, csvData);

        if (geography === 'puma') {
          processedCsvData = processPumaCsvData(csvData);
          mergedData = mergePumaData(geoJson, processedCsvData);
        } else if (geography === 'county') {
          processedCsvData = processCountyCsvData(csvData);
          mergedData = mergeCountyData(geoJson, processedCsvData);
        } else if (geography === 'tract') {
          processedCsvData = processTractCsvData(csvData);
          geoJson = cleanTractGeoJson(geoJson);
          mergedData = mergeTractData(geoJson, processedCsvData);
        }

        console.log(`Processed ${geography.toUpperCase()} CSV Data:`, processedCsvData);
        console.log(`Merged ${geography.toUpperCase()} Data:`, mergedData);

        setGeoData(geoJson);
        setMergedGeoData({ ...geoJson, features: mergedData });
        setSelectedFeature(null); // Reset the selected feature
        setShowCursor(false);  // Hide the cursor info panel
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    fetchData();
  }, [geography]);// Re-run the effect when geography changes

  const styleFeature = feature => ({
    fillColor: getColor(feature.properties.percentage),
    weight: 2,
    opacity: 1,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.7
  });

  const getColor = d => {
    return d > 10.5 ? '#800026' :
      d > 10 ? '#BD0026' :
      d > 9.5 ? '#E31A1C' :
      d > 9 ? '#FC4E2A' :
      d > 8.5 ? '#FD8D3C' :
      d > 6 ? '#FEB24C' :
      '#FFEDA0';
  };

  const onEachFeature = (feature, layer) => {
    layer.on({
      click: e => {
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
        setShowCursor(true);
        setSelectedFeature(feature.properties);
      }
    });
  };

  if (!mergedGeoData) {
    return <div>Loading...</div>;
  }

  const bounds = [
    [15.0, -130.0],
    [55.0, -60.0]
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
        {/* Use a unique key for GeoJSON to force re-render */}
        <GeoJSON key={`${geography}-${Date.now()}`} data={mergedGeoData} style={styleFeature} onEachFeature={onEachFeature} />
        <Legend />
      </MapContainer>

      {showCursor && (
        <div
          className="custom-cursor"
          style={{
            top: cursorPosition.y,
            left: cursorPosition.x,
            position: 'absolute',
            width: '20px',
            height: '20px',
            backgroundColor: '#F4A460',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
          }}
        />
      )}

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
          {geography === 'puma' && (
            <>
              <p>{selectedFeature.NAMELSAD10 || 'N/A'}</p>
              <p>Alzheimers Incidence Rate by Puma: {selectedFeature.percentage ? `${selectedFeature.percentage}%` : 'N/A'}</p>
            </>
          )}
          {geography === 'county' && (
            <>
              <p>{selectedFeature.NAME || 'N/A'}</p>
              <p>Alzheimers Incidence Rate by County: {selectedFeature.percentage ? `${selectedFeature.percentage}%` : 'N/A'}</p>
            </>
          )}
          {geography === 'tract' && (
            <>
              <p>{selectedFeature.NAMELSAD || 'N/A'}</p>
              <p>Alzheimers Incidence Rate by Tract: {selectedFeature.percentage ? `${selectedFeature.percentage}%` : 'N/A'}</p>
            </>
          )}
          
        </div>
      )}
    </div>
  );
};

// Functions to process CSV data
const processPumaCsvData = (csvData) => {
  return csvData.map(row => ({
    ...row,
    GEOID: row.GEOID,
    percentage: row.percentage ? parseFloat(row.percentage) : null
  })).filter(row => row.GEOID && row.percentage !== null);
};

// Functions to merge CSV data with GeoJSON data
const mergePumaData = (geoJson, csvData) => {
  return geoJson.features.map(feature => {
    const matchingCsvData = csvData.find(row => row.GEOID === feature.properties.GEOID10);

    if (matchingCsvData) {
      console.log('PUMA Match:', matchingCsvData, feature);
      feature.properties.percentage = matchingCsvData.percentage;
    }
    return feature;
  });
};

const processTractCsvData = (csvData) => {
  return csvData.map(row => ({
    ...row,
    county: row.county,
    tracta: row.tracta,
    percentage: row.percentage ? parseFloat(row.percentage) : null
  })).filter(row => row.county && row.tracta && row.percentage !== null);
};

// Function to clean GeoJSON data for tracts
const cleanTractGeoJson = (geoJson) => {
  geoJson.features.forEach(feature => {
    feature.properties.COUNTYFP = feature.properties.COUNTYFP.replace(/^0+/, '');
    feature.properties.TRACTCE = feature.properties.TRACTCE.replace(/^0+/, '');
  });
  return geoJson;
};

const mergeTractData = (geoJson, csvData) => {
  return geoJson.features.map(feature => {
    const matchingCsvData = csvData.find(row => row.county1 === feature.properties.COUNTYFP && row.tracta === feature.properties.TRACTCE);

    if (matchingCsvData) {
      console.log('Tract Match:', matchingCsvData, feature);
      feature.properties.percentage = matchingCsvData.percentage;
    }
    return feature;
  });
};

const processCountyCsvData = (csvData) => {
  return csvData.map(row => ({
    ...row,
    GEOID: row.GEOID,
    percentage: row.percentage ? parseFloat(row.percentage) : null
  })).filter(row => row.GEOID && row.percentage !== null);
};


const mergeCountyData = (geoJson, csvData) => {
  return geoJson.features.map(feature => {
    const matchingCsvData = csvData.find(row => row.GEOID === feature.properties.COUNTYFP);

    if (matchingCsvData) {
      console.log('County Match:', matchingCsvData, feature);
      feature.properties.percentage = matchingCsvData.percentage;
    }
    return feature;
  });
};


export default MapComponent;

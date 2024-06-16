import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import Papa from 'papaparse';
import 'leaflet/dist/leaflet.css';
import './MapComponent.css';
import Legend from './Legend';

const MapComponent = ({ geography, variable, age, sex, race }) => {
  const [geoData, setGeoData] = useState(null);
  const [mergedGeoData, setMergedGeoData] = useState(null);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [showCursor, setShowCursor] = useState(false);

  useEffect(() => {
    console.log("Fetching data for geography:", geography, "and variable:", variable, "with demographics:", age, sex, race);

    const fetchData = async () => {
      try {
        let geoJsonPath, csvPath, mergeKey;
        let processedCsvData, mergedData;
        let geoJson;

        if (variable === 'Dhanawithedu' || variable === 'Dhanawithoutedu') {
          if (geography === 'puma') {
            geoJsonPath = '/data/puma_maine.geojson';
            if (age || sex || race) {
              csvPath = variable === 'Dhanawithedu' 
                ? '/data/maine_puma_binary_withedu2.csv' 
                : '/data/maine_puma_binary_withoutedu2.csv';
            } else {
              csvPath = variable === 'Dhanawithedu' 
                ? '/data/ACS_Maine_Puma_Level_Alzheimer_Estimates_withedu.csv' 
                : '/data/ACS_Maine_Puma_Level_Alzheimer_Estimates_withoutedu.csv';
            }
            mergeKey = 'GEOID10';
          } else if (geography === 'county2') {
            geoJsonPath = '/data/modified_county_maine.geojson';
            csvPath = '/data/NCHS_Maine_County_Level_Alzheimer_Estimates.csv';
            mergeKey = 'COUNTYFP';
          } else if (geography === 'tract') {
            geoJsonPath = '/data/tract_maine.geojson';
            csvPath = variable === 'Dhanawithedu' 
              ? '/data/tract_maine_alzheimer_probabilities_withedu.csv' 
              : '/data/tract_maine_alzheimer_probabilities_withoutedu.csv';
            mergeKey = 'GEOID';
          }
        } else if (variable === 'DirectEstimates') {
          if (geography === 'zipcode') {
            geoJsonPath = '/data/Maine_ZCTAs.geojson';
            csvPath = '/data/zipcode_maine_alzheimers_direct_estimates.csv';
            mergeKey = 'ZCTA5CE10';
          } else if (geography === 'county1') {
            geoJsonPath = '/data/modified_county_maine.geojson';
            csvPath = '/data/county_maine_direct_estimates.csv';
            mergeKey = 'COUNTYFP';
          } else if (geography === 'district') {
            geoJsonPath = '/data/Maine_district.geojson';
            csvPath = '/data/district_maine_alzheimers_direct_estimates.csv';
            mergeKey = 'District';
          } else if (geography === 'urbanRural') {
            geoJsonPath = '/data/maine_urbnrrl.geojson';
            csvPath = '/data/maine_urbnrrl.csv';
            mergeKey = 'URBNRRL';
          }
        }

        if (!geoJsonPath || !csvPath) {
          throw new Error(`Unsupported geography: ${geography} or variable: ${variable}`);
        }

        console.log(`GeoJSON Path: ${geoJsonPath}, CSV Path: ${csvPath}`);

        const [geoJsonResponse, csvResponse] = await Promise.all([
          fetch(geoJsonPath),
          fetch(csvPath)
        ]);

        if (!geoJsonResponse.ok) {
          throw new Error(`Failed to fetch GeoJSON data from ${geoJsonPath}, status: ${geoJsonResponse.status}`);
        }

        if (!csvResponse.ok) {
          throw new Error(`Failed to fetch CSV data from ${csvPath}, status: ${csvResponse.status}`);
        }

        geoJson = await geoJsonResponse.json();
        const csvText = await csvResponse.text();
        const csvData = Papa.parse(csvText, { header: true }).data;

        console.log("CSV Data:", csvData);

        if (geography === 'puma') {
          if (!age && !sex && !race) {
            processedCsvData = processPumaCsvData(csvData);
            mergedData = mergePumaData(geoJson, processedCsvData);
          } else {
            processedCsvData = processPumaCsvDataWithDemographics(csvData, age, sex, race);
            mergedData = mergePumaDataWithDemographics(geoJson, processedCsvData);
          }
        } else if (geography === 'county2') {
          processedCsvData = processCounty2CsvData(csvData);
          mergedData = mergeCounty2Data(geoJson, processedCsvData);
        } else if (geography === 'tract') {
          processedCsvData = processTractCsvData(csvData);
          geoJson = cleanTractGeoJson(geoJson);
          mergedData = mergeTractData(geoJson, processedCsvData);
        } else if (geography === 'zipcode') {
          processedCsvData = processZipcodeCsvData(csvData);
          mergedData = mergeZipcodeData(geoJson, processedCsvData, mergeKey);
        } else if (geography === 'county1') {
          processedCsvData = processCounty1CsvData(csvData);
          mergedData = mergeCounty1Data(geoJson, processedCsvData);
        } else if (geography === 'district') {
          processedCsvData = processDistrictCsvData(csvData);
          mergedData = mergeDistrictData(geoJson, processedCsvData);
        } else if (geography === 'urbanRural') {
          processedCsvData = processUrbanRuralCsvData(csvData);
          mergedData = mergeUrbanRuralData(geoJson, processedCsvData, mergeKey);
        }

        console.log(`Processed ${geography.toUpperCase()} CSV Data:`, processedCsvData);
        console.log(`Merged ${geography.toUpperCase()} Data:`, mergedData);

        setGeoData(geoJson);
        setMergedGeoData({ ...geoJson, features: mergedData });
        setSelectedFeature(null); // Reset the selected feature
        setShowCursor(false);  // Hide the cursor info panel
      } catch (error) {
        console.error('Error loading data:', error.message);
      }
    };

    fetchData();
  }, [geography, variable, age, sex, race]); // Re-run the effect when geography, variable, age, sex, or race changes

  const styleFeature = feature => ({
    fillColor: getColor(feature.properties.percentage),
    weight: 2,
    opacity: 1,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.7
  });

  const getColor = d => {
    if (d === 'NA' || d === null || d === undefined) return '#FFFFFF'; // White color for 'NA' values
    return d > 10.5 ? '#800026' :
      d > 10 ? '#BD0026' :
      d > 9 ? '#E31A1C' :
      d > 8 ? '#FC4E2A' :
      d > 7 ? '#FD8D3C' :
      d > 6 ? '#FEB24C' :
      d > 5 ? '#FFEDA0' :
      '#FFFAF0'; 
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
        <GeoJSON key={`${geography}-${variable}-${age}-${sex}-${race}-${Date.now()}`} data={mergedGeoData} style={styleFeature} onEachFeature={onEachFeature} />
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
              <p>PUMA: {selectedFeature.GEOID10 || 'N/A'}</p>
              <p>Alzheimers Incidence Rate by PUMA: {selectedFeature.percentage ? `${selectedFeature.percentage}%` : 'N/A'}</p>
            </>
          )}
          {geography === 'county2' && (
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
          {geography === 'zipcode' && (
            <>
              <p>Zipcode: {selectedFeature.ZCTA5CE10 || 'N/A'}</p>
              <p>Alzheimers Incidence Rate by Zipcode: {selectedFeature.percentage ? `${selectedFeature.percentage}%` : 'N/A'}</p>
            </>
          )}
          {geography === 'county1' && (
            <>
              <p>{selectedFeature.NAME || 'N/A'}</p>
              <p>Alzheimers Incidence Rate by County: {selectedFeature.percentage ? `${selectedFeature.percentage}%` : 'N/A'}</p>
            </>
          )}
          {geography === 'district' && (
            <>
              <p>{selectedFeature.name || 'N/A'}</p> 
              <p>Alzheimers Incidence Rate by District: {selectedFeature.percentage ? `${selectedFeature.percentage}%` : 'N/A'}</p>
            </>
          )}
          {geography === 'urbanRural' && (
            <>
              <p>{selectedFeature.URBNRRL || 'N/A'}</p>
              <p>Alzheimers Incidence Rate by Urban/Rural: {selectedFeature.percentage ? `${selectedFeature.percentage}%` : 'N/A'}</p>
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

const processPumaCsvDataWithDemographics = (csvData, age, sex, race) => {
  const filteredData = csvData.filter(row => 
    (!age || row[age] === '1') && 
    (!sex || row[sex] === '1') && 
    (!race || row[race] === '1')
  );

  // Create a mapping of GEOID to the corresponding filtered row
  const geoDataMap = new Map();
  filteredData.forEach(row => {
    const geoId = row.GEOID;
    if (!geoDataMap.has(geoId)) {
      geoDataMap.set(geoId, row);
    }
  });

  return Array.from(geoDataMap.values()).map(row => ({
    ...row,
    GEOID: row.GEOID,
    percentage: row.percentage ? parseFloat(row.percentage) : null
  })).filter(row => row.GEOID && row.percentage !== null);
};


const processCounty2CsvData = (csvData) => {
  return csvData.map(row => ({
    ...row,
    GEOID: row.GEOID,
    percentage: row.percentage ? parseFloat(row.percentage) : null
  })).filter(row => row.GEOID && row.percentage !== null);
};

const processTractCsvData = (csvData) => {
  return csvData.map(row => ({
    ...row,
    county: row.county1,
    tracta: row.tracta,
    percentage: row.percentage ? parseFloat(row.percentage) : null
  })).filter(row => row.county && row.tracta && row.percentage !== null);
};

const processZipcodeCsvData = (csvData) => {
  return csvData.map(row => ({
    ...row,
    GEOID: row.GEOID.replace(/^0+/, ''), // Remove leading zeros
    percentage: row.percentage ? parseFloat(row.percentage) : null
  })).filter(row => row.GEOID && row.percentage !== null);
};

const processCounty1CsvData = (csvData) => {
  return csvData.map(row => ({
    ...row,
    GEOID: row.GEOID,
    percentage: row.percentage ? parseFloat(row.percentage) : null
  })).filter(row => row.GEOID && row.percentage !== null);
};

const processDistrictCsvData = (csvData) => {
  return csvData.map(row => ({
    ...row,
    GEOID: row.GEOID,
    name: row.name, 
    percentage: row.percentage ? parseFloat(row.percentage) : null
  })).filter(row => row.GEOID && row.percentage !== null);
};

const processUrbanRuralCsvData = (csvData) => {
  return csvData.map(row => ({
    ...row,
    GEOID: row.GEOID,
    name: row.NAME, 
    percentage: row.percentage ? parseFloat(row.percentage) : null
  })).filter(row => row.GEOID && row.percentage !== null);
};

// Function to clean GeoJSON data for tracts
const cleanTractGeoJson = (geoJson) => {
  geoJson.features.forEach(feature => {
    feature.properties.COUNTYFP = feature.properties.COUNTYFP.replace(/^0+/, '');
    feature.properties.TRACTCE = feature.properties.TRACTCE.replace(/^0+/, '');
  });
  return geoJson;
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

const mergePumaDataWithDemographics = (geoJson, csvData) => {
  return geoJson.features.map(feature => {
    const matchingCsvData = csvData.find(row => row.GEOID === feature.properties.GEOID10);

    if (matchingCsvData) {
      console.log('PUMA Match with Demographics:', matchingCsvData, feature);
      feature.properties.percentage = matchingCsvData.percentage;
    }
    return feature;
  });
};


const mergeCounty2Data = (geoJson, csvData) => {
  return geoJson.features.map(feature => {
    const matchingCsvData = csvData.find(row => row.GEOID === feature.properties.COUNTYFP);

    if (matchingCsvData) {
      console.log('County Match:', matchingCsvData, feature);
      feature.properties.percentage = matchingCsvData.percentage;
    }
    return feature;
  });
};

const mergeTractData = (geoJson, csvData) => {
  return geoJson.features.map(feature => {
    const matchingCsvData = csvData.find(row => row.county === feature.properties.COUNTYFP && row.tracta === feature.properties.TRACTCE);

    if (matchingCsvData) {
      console.log('Tract Match:', matchingCsvData, feature);
      feature.properties.percentage = matchingCsvData.percentage;
    }
    return feature;
  });
};

const mergeZipcodeData = (geoJson, csvData, mergeKey) => {
  return geoJson.features.map(feature => {
    const featureGEOID = feature.properties[mergeKey].replace(/^0+/, ''); // Remove leading zeros
    const matchingCsvData = csvData.find(row => row.GEOID === featureGEOID);

    if (matchingCsvData) {
      feature.properties.percentage = matchingCsvData.percentage;
    }
    return feature;
  });
};

const mergeCounty1Data = (geoJson, csvData) => {
  return geoJson.features.map(feature => {
    const matchingCsvData = csvData.find(row => row.GEOID === feature.properties.COUNTYFP);

    if (matchingCsvData) {
      console.log('County Match:', matchingCsvData, feature);
      feature.properties.percentage = matchingCsvData.percentage;
    }
    return feature;
  });
};

const mergeDistrictData = (geoJson, csvData) => {
  return geoJson.features.map((feature, index) => {
    const districtCode = feature.properties['District'];

    if (!districtCode) {
      console.warn(`Feature at index ${index} has no District code. Feature properties:`, feature.properties);
      return feature;
    }

    // Log the district code being processed
    console.log(`Processing district code: ${districtCode}`);

    const matchingCsvData = csvData.find(row => row.GEOID.toString() === districtCode.toString());

    if (matchingCsvData) {
      console.log('District Match:', matchingCsvData, feature);
      feature.properties.percentage = parseFloat(matchingCsvData.percentage);  // Ensure the percentage is a number
      feature.properties.name = matchingCsvData.name; 
    } else {
      console.warn(`No match found for district code: ${districtCode}`);
    }
    return feature;
  });
};

const mergeUrbanRuralData = (geoJson, csvData) => {
  return geoJson.features.map((feature, index) => {
    const URBNRRLCode = feature.properties['URBNRRL'];

    if (!URBNRRLCode) {
      console.warn(`Feature at index ${index} has no URBNRRL code. Feature properties:`, feature.properties);
      return feature;
    }

    const matchingCsvData = csvData.find(row => row.GEOID.toString() === URBNRRLCode.toString());

    if (matchingCsvData) {
      console.log('URBNRRL Match:', matchingCsvData, feature);
      feature.properties.percentage = parseFloat(matchingCsvData.percentage);  // Ensure the percentage is a number
      feature.properties.name = matchingCsvData.name; 
    } else {
      console.warn(`No match found for URBNRRL code: ${URBNRRLCode}`);
    }
    return feature;
  });
};

export default MapComponent;

import React, { useState } from 'react';
import { MenuItem, FormControl, Typography, Box, Select, InputAdornment, Divider } from '@mui/material';
import PublicIcon from '@mui/icons-material/Public';
import SchoolIcon from '@mui/icons-material/School';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import GroupIcon from '@mui/icons-material/Group';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#ffab40', // Apricot color
    },
    text: {
      primary: '#333333', // Dark grey color for text
    },
  },
  typography: {
    fontFamily: 'Arial, sans-serif',
    h5: {
      fontFamily: 'Georgia, serif',
      fontWeight: 'bold',
      color: '#333333', // Dark grey color for text
    },
  },
});

const Sidebar = ({ onGeographyChange, onVariableChange, onAgeChange, onSexChange, onRaceChange, onEducationChange, onYearChange, onDemographicChange }) => {
  const [selectedEstimate, setSelectedEstimate] = useState('');
  const [selectedGeography, setSelectedGeography] = useState('');
  const [selectedAge, setSelectedAge] = useState('');
  const [selectedSex, setSelectedSex] = useState('');
  const [selectedRace, setSelectedRace] = useState('');
  const [selectedEducation, setSelectedEducation] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [showDemographicVariables, setShowDemographicVariables] = useState(false);

  const handleVariableChange = (event) => {
    setSelectedEstimate(event.target.value);
    onVariableChange(event.target.value);
  };

  const handleGeographyChange = (event) => {
    setSelectedGeography(event.target.value);
    onGeographyChange(event.target.value);
  };

  const handleAgeChange = (event) => {
    setSelectedAge(event.target.value);
    onAgeChange(event.target.value);
  };

  const handleSexChange = (event) => {
    setSelectedSex(event.target.value);
    onSexChange(event.target.value);
  };

  const handleRaceChange = (event) => {
    setSelectedRace(event.target.value);
    onRaceChange(event.target.value);
  };

  const handleEducationChange = (event) => {
    setSelectedEducation(event.target.value);
    onEducationChange(event.target.value);
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
    onYearChange(event.target.value);
  };

  const handleDemographicChange = (event) => {
    setShowDemographicVariables(event.target.value === 'Yes');
    onDemographicChange(event.target.value === 'Yes');
  };

  const ageOptions = selectedEstimate === 'DirectEstimates'
    ? ["45-64", "65-69", "70-74", "75-79", "80-85", "85+"]
    : ["65-69", "70-74", "75-79", "80-85", "85+"];

  const sexOptions = ["Male", "Female"];

  const raceOptions = selectedEstimate === 'DirectEstimates'
    ? ["Hispanic", "Black", "White", "Asian and PI", "American Indian or Alaska Native", "Other"]
    : ["Hispanic", "Black", "Other"];

  const educationOptions = [
    "Never attended school or kindergarten only",
    "Elementary",
    "Some High school",
    "High school graduate",
    "Some college or technical school",
    "College graduate"
  ];

  const yearOptionsDirectEstimates = ["2012", "2016", "2017", "2018", "2020"];
  const yearOptionsClaims = ["2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020"];

  const labelStyle = {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#333333', // Dark grey color for text
    marginBottom: '5px',
  };

  const iconStyle = {
    marginRight: '8px',
  };

  const selectFieldStyle = {
    width: '100%',
    height: '40px',
    fontSize: '14px',
    backgroundColor: '#ffffff',
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ width: 300, padding: 3, background: '#ffab40', borderRadius: 0, boxShadow: 3 }}>
        <Typography variant="h5" gutterBottom>
          Select desired options to populate dashboard
        </Typography>

        <Divider sx={{ marginBottom: 2, backgroundColor: '#333333' }} />

        <Box sx={{ marginBottom: 2 }}>
          <Typography sx={labelStyle}>Select Estimates</Typography>
          <FormControl fullWidth>
            <Select
              value={selectedEstimate}
              onChange={handleVariableChange}
              startAdornment={
                <InputAdornment position="start">
                  <SchoolIcon sx={iconStyle} />
                </InputAdornment>
              }
              sx={selectFieldStyle}
            >
              <MenuItem value="Dhanawithedu">Dhana ADRD model with education</MenuItem>
              <MenuItem value="Dhanawithoutedu">Dhana ADRD model without education</MenuItem>
              <MenuItem value="DirectEstimates">MaineCDC BRFSS Cognitive decline Direct estimates</MenuItem>
              <MenuItem value="Claims">Maine Health ADRD Claims Data</MenuItem>
              <MenuItem value="refinedacs">Refined demographics model</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ marginBottom: 2 }}>
          <Typography sx={labelStyle}>Select Geography</Typography>
          <FormControl fullWidth>
            <Select
              value={selectedGeography}
              onChange={handleGeographyChange}
              startAdornment={
                <InputAdornment position="start">
                  <PublicIcon sx={iconStyle} />
                </InputAdornment>
              }
              sx={selectFieldStyle}
            >
              {selectedEstimate === 'DirectEstimates' ? (
                [
                  <MenuItem key="zipcode" value="zipcode">Zipcode</MenuItem>,
                  <MenuItem key="county1" value="county1">County</MenuItem>,
                  <MenuItem key="district" value="district">District</MenuItem>,
                  <MenuItem key="urbanRural" value="urbanRural">Urban Rural</MenuItem>
                ]
              ) : selectedEstimate === 'Claims' ? (
                <MenuItem key="county3" value="county3">County</MenuItem>
              ) : selectedEstimate === 'refinedacs' ? (
                <MenuItem key="puma2" value="puma2">PUMA</MenuItem>
              ) : selectedEstimate === 'Dhanawithedu' ? (
                [
                  <MenuItem key="puma" value="puma">PUMA</MenuItem>,
                  <MenuItem key="tract" value="tract">Tract</MenuItem>
                ]
              ) : selectedEstimate === 'Dhanawithoutedu' ? (
                [
                  <MenuItem key="puma" value="puma">PUMA</MenuItem>,
                  <MenuItem key="county2" value="county2">County</MenuItem>,
                  <MenuItem key="tract" value="tract">Tract</MenuItem>
                ]
              ) : null}
            </Select>
          </FormControl>
        </Box>

        {(selectedEstimate === 'DirectEstimates' && showDemographicVariables) && (
          <Box sx={{ marginBottom: 2 }}>
            <Typography sx={labelStyle}>Select Year</Typography>
            <FormControl fullWidth>
              <Select
                value={selectedYear}
                onChange={handleYearChange}
                startAdornment={
                  <InputAdornment position="start">
                    <AccessTimeIcon sx={iconStyle} />
                  </InputAdornment>
                }
                sx={selectFieldStyle}
              >
                {yearOptionsDirectEstimates.map(year => (
                  <MenuItem key={year} value={year}>{year}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        )}

        {selectedEstimate === 'DirectEstimates' && (
          <>
            <Box sx={{ marginBottom: 2 }}>
              <Typography sx={labelStyle}>Select Demographic Variables</Typography>
              <FormControl fullWidth>
                <Select
                  value={showDemographicVariables ? 'Yes' : 'No'}
                  onChange={handleDemographicChange}
                  sx={selectFieldStyle}
                >
                  <MenuItem value="Yes">Yes</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {showDemographicVariables && (
              <>
                <Box sx={{ marginBottom: 2 }}>
                  <Typography sx={labelStyle}>Select Age</Typography>
                  <FormControl fullWidth>
                    <Select
                      value={selectedAge}
                      onChange={handleAgeChange}
                      startAdornment={
                        <InputAdornment position="start">
                          <AccessTimeIcon sx={iconStyle} />
                        </InputAdornment>
                      }
                      sx={selectFieldStyle}
                    >
                      {ageOptions.map(age => (
                        <MenuItem key={age} value={age}>{age}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                <Box sx={{ marginBottom: 2 }}>
                  <Typography sx={labelStyle}>Select Sex</Typography>
                  <FormControl fullWidth>
                    <Select
                      value={selectedSex}
                      onChange={handleSexChange}
                      startAdornment={
                        <InputAdornment position="start">
                          <GroupIcon sx={iconStyle} />
                        </InputAdornment>
                      }
                      sx={selectFieldStyle}
                    >
                      {sexOptions.map(sex => (
                        <MenuItem key={sex} value={sex}>{sex}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                <Box sx={{ marginBottom: 2 }}>
                  <Typography sx={labelStyle}>Select Race</Typography>
                  <FormControl fullWidth>
                    <Select
                      value={selectedRace}
                      onChange={handleRaceChange}
                      startAdornment={
                        <InputAdornment position="start">
                          <GroupIcon sx={iconStyle} />
                        </InputAdornment>
                      }
                      sx={selectFieldStyle}
                    >
                      {raceOptions.map(race => (
                        <MenuItem key={race} value={race}>{race}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                <Box sx={{ marginBottom: 2 }}>
                  <Typography sx={labelStyle}>Select Education Level</Typography>
                  <FormControl fullWidth>
                    <Select
                      value={selectedEducation}
                      onChange={handleEducationChange}
                      startAdornment={
                        <InputAdornment position="start">
                          <SchoolIcon sx={iconStyle} />
                        </InputAdornment>
                      }
                      sx={selectFieldStyle}
                    >
                      {educationOptions.map(education => (
                        <MenuItem key={education} value={education}>{education}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </>
            )}
          </>
        )}
      </Box>
    </ThemeProvider>
  );
};

export default Sidebar;

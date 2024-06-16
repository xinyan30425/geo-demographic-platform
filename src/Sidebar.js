import React, { useState } from 'react';
import { MenuItem, FormControl, InputLabel, Typography, Box, Select, InputAdornment, Divider } from '@mui/material';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import PublicIcon from '@mui/icons-material/Public';
import SchoolIcon from '@mui/icons-material/School';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#F4A460',
    },
  },
  typography: {
    fontFamily: 'Arial, sans-serif',
    h5: {
      fontFamily: 'Georgia, serif',
      fontWeight: 'bold',
      color: '#F4A460',
    },
  },
});

const Sidebar = ({ onGeographyChange, onVariableChange, onAgeChange, onSexChange, onRaceChange, onDemographicChange }) => {
  const [selectedEstimate, setSelectedEstimate] = useState('');
  const [selectedGeography, setSelectedGeography] = useState('');
  const [selectedAge, setSelectedAge] = useState('');
  const [selectedSex, setSelectedSex] = useState('');
  const [selectedRace, setSelectedRace] = useState('');
  const [showDemographics, setShowDemographics] = useState(false);

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

  const handleDemographicChange = (event) => {
    setShowDemographics(event.target.value === 'Yes');
    onDemographicChange(event.target.value === 'Yes');
  };

  const ageOptions = selectedEstimate === 'DirectEstimates'
    ? ["45-64", "65-69", "70-74", "75-79", "80-84", "85+"]
    : ["65-69", "70-74", "75-79", "80-84", "85+"];

  const sexOptions = ["Male", "Female"];

  const raceOptions = selectedEstimate === 'DirectEstimates'
    ? ["Hispanic", "Black", "White", "Asian and PI", "American Indian or Alaska Native", "Other"]
    : ["Hispanic", "Black", "Other"];

  const dropdownStyle = {
    fontSize: '14px',
    padding: '0px',
    backgroundColor: '#fff',
    borderRadius: '4px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    '&:hover': {
      backgroundColor: '#f5f5f5',
    },
  };

  const labelStyle = {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#F4A460',
    marginBottom: '5px',
  };

  const typographyStyle = {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#F4A460',
    marginBottom: '20px',
    fontFamily: 'Georgia, serif',
  };

  const iconStyle = {
    marginRight: '8px',
  };

  const selectFieldStyle = {
    width: '100%',
    height: '40px',
    fontSize: '14px',
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ width: 300, padding: 3, background: 'linear-gradient(135deg, #4f4f4f, #666666)', borderRadius: 0, boxShadow: 3 }}>
        <Typography variant="h5" gutterBottom>
          Select desired options to populate dashboard
        </Typography>

        <Divider sx={{ marginBottom: 2, backgroundColor: '#F4A460' }} />

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
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ marginBottom: 2 }}>
          <Typography>Select Geography</Typography>
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
              ) : (
                [
                  <MenuItem key="puma" value="puma">PUMA</MenuItem>,
                  <MenuItem key="county2" value="county2">County</MenuItem>,
                  <MenuItem key="tract" value="tract">Tract</MenuItem>
                ]
              )}
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ marginBottom: 2 }}>
          <Typography>Select Demographic Variables</Typography>
          <FormControl fullWidth>
            <Select
              value={showDemographics ? 'Yes' : 'No'}
              onChange={handleDemographicChange}
              sx={selectFieldStyle}
            >
              <MenuItem value="Yes">Yes</MenuItem>
              <MenuItem value="No">No</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {showDemographics && (
          <>
            <Box sx={{ marginBottom: 2 }}>
              <Typography>Select Age</Typography>
              <FormControl fullWidth>
                <Select
                  value={selectedAge}
                  onChange={handleAgeChange}
                  sx={selectFieldStyle}
                >
                  {ageOptions.map(age => (
                    <MenuItem key={age} value={age}>{age}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ marginBottom: 2 }}>
              <Typography>Select Sex</Typography>
              <FormControl fullWidth>
                <Select
                  value={selectedSex}
                  onChange={handleSexChange}
                  sx={selectFieldStyle}
                >
                  {sexOptions.map(sex => (
                    <MenuItem key={sex} value={sex}>{sex}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ marginBottom: 2 }}>
              <Typography>Select Race</Typography>
              <FormControl fullWidth>
                <Select
                  value={selectedRace}
                  onChange={handleRaceChange}
                  sx={selectFieldStyle}
                >
                  {raceOptions.map(race => (
                    <MenuItem key={race} value={race}>{race}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </>
        )}
      </Box>
    </ThemeProvider>
  );
};

export default Sidebar;



{/* <Box sx={{ marginBottom: 2 }}>
          <Typography sx={labelStyle}>Select School Type</Typography>
          <TextField
            select
            SelectProps={{
              onChange: onVariableChange,
              sx: dropdownStyle,
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SchoolIcon sx={iconStyle} />
                </InputAdornment>
              ),
            }}
            sx={textFieldStyle}
            defaultValue=""
          >
            <MenuItem value="elementary">Elementary</MenuItem>
            <MenuItem value="middleSchool">Middle School</MenuItem>
            <MenuItem value="highSchool">High School</MenuItem>
          </TextField>
        </Box> */}

        {/* <Box sx={{ marginBottom: 2 }}>
          <Typography sx={labelStyle}>Select MIYHS Topic Area</Typography>
          <TextField
            select
            SelectProps={{
              onChange: onVariableChange,
              sx: dropdownStyle,
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <HealthAndSafetyIcon sx={iconStyle} />
                </InputAdornment>
              ),
            }}
            sx={textFieldStyle}
            defaultValue=""
          >
            <MenuItem value="foodSupply">Food Supply</MenuItem>
            <MenuItem value="foodInsecurity">Food Insecurity</MenuItem>
            <MenuItem value="highFatFood">Have High Fat Food</MenuItem>
            <MenuItem value="mentalHealth">Mental Health</MenuItem>
          </TextField>
        </Box> */}

                {/* <Box sx={{ marginBottom: 2 }}>
          <Typography sx={labelStyle}>Select Gender</Typography>
          <TextField
            select
            SelectProps={{
              onChange: onVariableChange,
              sx: dropdownStyle,
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <WcIcon sx={iconStyle} />
                </InputAdornment>
              ),
            }}
            sx={textFieldStyle}
            defaultValue=""
          >
            <MenuItem value="female">Female</MenuItem>
            <MenuItem value="male">Male</MenuItem>
          </TextField>
        </Box> */}

        {/* <Box sx={{ marginBottom: 2 }}>
          <Typography sx={labelStyle}>Select Race</Typography>
          <TextField
            select
            SelectProps={{
              onChange: onVariableChange,
              sx: dropdownStyle,
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PeopleIcon sx={iconStyle} />
                </InputAdornment>
              ),
            }}
            sx={textFieldStyle}
            defaultValue=""
          >
            <MenuItem value="hispanic">Hispanic</MenuItem>
            <MenuItem value="black">Black</MenuItem>
            <MenuItem value="white">White</MenuItem>
            <MenuItem value="asian">Asian and PI</MenuItem>
            <MenuItem value="americanIndian">American Indian</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </TextField>
        </Box> */}

        {/* <Box sx={{ marginBottom: 2 }}>
          <Typography sx={labelStyle}>Select Grade</Typography>
          <TextField
            select
            SelectProps={{
              onChange: onVariableChange,
              sx: dropdownStyle,
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CakeIcon sx={iconStyle} />
                </InputAdornment>
              ),
            }}
            sx={textFieldStyle}
            defaultValue=""
          >
            <MenuItem value="0-4">1-2</MenuItem>
            <MenuItem value="5-9">3-4</MenuItem>
            <MenuItem value="10-14">5-6</MenuItem>
            <MenuItem value="15-19">7-8</MenuItem>
            <MenuItem value="20-25">9-10</MenuItem>
            <MenuItem value="20-25">11-12</MenuItem>
          </TextField>
        </Box> */}
import React from 'react';
import { Select, MenuItem, FormControl, InputLabel, Typography, Box, TextField, InputAdornment } from '@mui/material';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import PublicIcon from '@mui/icons-material/Public';
import WcIcon from '@mui/icons-material/Wc';
import PeopleIcon from '@mui/icons-material/People';
import CakeIcon from '@mui/icons-material/Cake';
import SchoolIcon from '@mui/icons-material/School';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#F4A460', // Darker apricot color
    },
  },
  typography: {
    fontFamily: 'Arial, sans-serif',
  },
});

const Sidebar = ({ onVariableChange, onGeographyChange }) => {
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
    color: '#F4A460', // Darker apricot color
    marginBottom: '5px',
  };

  const typographyStyle = {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#F4A460', // Darker apricot color
    marginBottom: '20px',
  };

  const iconStyle = {
    marginRight: '8px',
  };

  const textFieldStyle = {
    '.MuiInputBase-root': {
      paddingLeft: '50px',
      fontSize: '12px',
      width: '100%',
      height: '40px', // Set a fixed height for the TextField
      transition: 'background-color 0.3s ease',
    },
    '.MuiInputAdornment-root': {
      position: 'absolute',
      left: '10px',
    },
    width: '100%',
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ width: 300, padding: 3, background: 'linear-gradient(135deg, #4f4f4f, #666666)', borderRadius: 0, boxShadow: 3 }}>
        <Typography sx={typographyStyle} gutterBottom>
          Select desired options to populate dashboard
        </Typography>

        <Box sx={{ marginBottom: 2 }}>
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
        </Box>
        
        <Box sx={{ marginBottom: 2 }}>
          <Typography sx={labelStyle}>Select Geography</Typography>
          <TextField
            select
            SelectProps={{
              onChange: onGeographyChange,
              sx: dropdownStyle,
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PublicIcon sx={iconStyle} />
                </InputAdornment>
              ),
            }}
            sx={textFieldStyle}
            defaultValue=""
          >
            <MenuItem value="puma">PUMA</MenuItem>
            <MenuItem value="county">County</MenuItem>
            <MenuItem value="tract">Tract</MenuItem>
          </TextField>
        </Box>

        <Box sx={{ marginBottom: 2 }}>
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
        </Box>

        <Box sx={{ marginBottom: 2 }}>
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
        </Box>

        <Box sx={{ marginBottom: 2 }}>
          <Typography sx={labelStyle}>Select Age Group</Typography>
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
            <MenuItem value="0-4">0-4</MenuItem>
            <MenuItem value="5-9">5-9</MenuItem>
            <MenuItem value="10-14">10-14</MenuItem>
            <MenuItem value="15-19">15-19</MenuItem>
            <MenuItem value="20-25">20-25</MenuItem>
          </TextField>
        </Box>

        <Box sx={{ marginBottom: 2 }}>
          <Typography sx={labelStyle}>Select Education Attainment</Typography>
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
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Sidebar;

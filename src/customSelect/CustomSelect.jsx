import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';


const CustomSelect = ({ onSelect }) => {
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [cost, setCost] = useState(null);

  const apiUrl = process.env.REACT_APP_API_URL;


  const fetchData = async () => {
    const result = await axios.get(`${apiUrl}/api/v1/challenge/operations`);
    if (result.data && result.data.content) {
      const options = result.data.content.map((item) => ({
        label: item.type,
        value: item.type,
        cost: item.cost
      }));
      setOptions(options);
    } else {
      console.error('Unexpected data:', result);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSelection = (_, newValue) => {
    setSelectedOption(newValue);
    if (newValue) {
      onSelect(newValue.value);
      setCost(newValue.cost);
    } else {
      onSelect(null);
      setCost(null); 
    }
  };
  

  return (
    <div>
      <Autocomplete
        options={options}
        getOptionLabel={(option) => option.label}
        onChange={handleSelection}
        value={selectedOption}
        renderInput={(params) => <TextField {...params} variant="outlined" label="Operation Type" />}
      />
      {cost && (
        <Typography variant="body2" color="textSecondary" align="left" style={{ marginTop: '5px' }}>
          Costo de la operación: ${cost.toFixed(2)}
        </Typography>
      )}
    </div>
  );
};

export default CustomSelect;
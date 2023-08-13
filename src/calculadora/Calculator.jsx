import axios from 'axios';
import React, { useState } from 'react'
import CustomSelect from '../customSelect/CustomSelect.jsx'
import { Button, Grid, TextField, Paper, Typography, Container, Radio } from '@mui/material';
import PointsBox from './PointsBox.jsx';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

const Calculator = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [number1, setNumber1] = useState('');
  const [number2, setNumber2] = useState('');
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [quantity, setQuantity] = useState(10);
  const [length, setLength] = useState(10);
  const [useUppercase, setUseUppercase] = useState(false);
  const [stringOption, setStringOption] = useState(null);
  const [useNumericDigits, setUseNumericDigits] = useState(false);
  const [useLowercase, setUseLowercase] = useState(false);
  const [refreshPoints, setRefreshPoints] = useState(false);

  const apiUrl = process.env.REACT_APP_API_URL;

  const params = new URLSearchParams({
    type: selectedOption
  });

  const handleSelect = (option) => {
    setSelectedOption(option);
  };

  const handleCalculationRequest = () => {
    params.append('num1', number1);
    params.append('num2', number2);
  };

  const handleRandomStringRequest = () => {
    if (stringOption === 'UNIQUE') {
      params.append('unique', true);
    } else if (stringOption === 'IDENTICAL') {
      params.append('unique', false);
    }
    params.append('length', length);
    params.append('quantity', quantity);
    if (useUppercase) {
      params.append('uppercase', true);
    }
    if (useLowercase) {
      params.append('lowercase', true);
    }
    if (useNumericDigits) {
      params.append('numericDigits', true);
    }
  };

  const handleButtonClick = async () => {
    if (!selectedOption) {
      setErrorMsg("You must select an operation");
      setResult(null);
      return;
    }
    if (selectedOption === 'RANDOM_STRING' && !(useNumericDigits || useUppercase || useLowercase)) {
      setErrorMsg("You must select at least one of the options: Numeric digits, Uppercase letters, Lowercase letters");
      setResult(null);
      return;
    }

    if (selectedOption === 'RANDOM_STRING') {
      handleRandomStringRequest();
    }
    else {
      handleCalculationRequest();
    }
    const url = `${apiUrl}/api/v1/challenge/operations/execute?${params.toString()}`;
    try {
      const result = await axios.get(url.toString());
      setResult(result.data.response !== undefined ? result.data.response : result.data);
      setRefreshPoints(!refreshPoints);
      setErrorMsg(null);
    } catch (error) {
      setResult(null);
      if (error.response && error.response.status === 403 && error.response.data.message === "Insufficient funds") {
        setErrorMsg("Insufficient funds");
      } else if(error.response && error.response.status === 400){
        setErrorMsg("Error in the parameters");
      } else {
        setErrorMsg("There was an error processing your request");

      }
    }
  };

  return (
    <Container component="main" maxWidth="md">
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Typography component="h1" variant="h5" align="center">
            Calculator
          </Typography>
          <CustomSelect onSelect={handleSelect} />
          {selectedOption !== 'RANDOM_STRING' ? (
            <>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="Number 1"
                type="number"
                value={number1}
                onChange={(e) => setNumber1(e.target.value)}
              />
              {selectedOption !== 'SQUARE_ROOT' && (
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  type="number"
                  fullWidth
                  label="Number 2"
                  value={number2}
                  onChange={(e) => setNumber2(e.target.value)}
                />
              )}
            </>
          ) : (
            <>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="Generate random strings (maximum 10,000)"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="Each string should be characters long (maximum 32)"
                value={length}
                onChange={(e) => setLength(e.target.value)}
              />
              <FormControlLabel
                control={<Checkbox checked={useUppercase} onChange={() => setUseUppercase(!useUppercase)} />}
                label="Uppercase letters (A-Z)"
              />
              <FormControlLabel
                control={<Checkbox checked={useNumericDigits} onChange={() => setUseNumericDigits(!useNumericDigits)} />}
                label="Numeric digits (0-9)"
              />
              <FormControlLabel
                control={<Checkbox checked={useLowercase} onChange={() => setUseLowercase(!useLowercase)} />}
                label="Lowercase letters (a-z)"
              />
              <FormControlLabel
                control={
                  <Radio
                    checked={stringOption === 'UNIQUE'}
                    onChange={() => setStringOption('UNIQUE')}
                  />
                }
                label="Each string should be unique (like raffle tickets)"
              />
              <FormControlLabel
                control={
                  <Radio
                    checked={stringOption === 'IDENTICAL'}
                    onChange={() => setStringOption('IDENTICAL')}
                  />
                }
                label="Identical strings are allowed (like dice rolls)"
              />

            </>
          )}
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleButtonClick}
          >
            Enviar consulta
          </Button>
          <Paper elevation={3} style={{ padding: '20px', marginTop: '20px', overflowY: 'auto', maxHeight: '300px' }}>
            <Typography variant="h6" align="center">Resultado:</Typography>
            {result && (
              <>
                {Array.isArray(result) ? (
                  result.map((item, index) => (
                    <Typography variant="body1" align="center" key={index} style={{ wordWrap: 'break-word' }}>
                      {item}
                    </Typography>
                  ))
                ) : (
                  <Typography variant="h4" align="center" style={{ marginTop: '10px', wordWrap: 'break-word' }}>
                    {result}
                  </Typography>
                )}
              </>
            )}
            {errorMsg && (
              <Typography variant="body1" color="error" align="center" style={{ marginTop: '10px' }}>
                {errorMsg}
              </Typography>
            )}
          </Paper>

        </Grid>
        <Grid item xs={12} md={4}>
          <PointsBox refresh={refreshPoints} />
        </Grid>
      </Grid>
    </Container>
  )
}

export default Calculator
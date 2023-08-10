import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../auth/AuthProvider';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Box } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import axios from 'axios';

const RecordsTable = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [lastPage, setLastPage] = useState(false);
  const { userId } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState('date');
  const [sortDirection, setSortDirection] = useState('asc');

  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchData();
  }, [page, searchTerm, sortColumn, sortDirection]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/v1/challenge/records?userId=${userId}&page=${page}&size=${size}&text=${searchTerm}&sort=${sortColumn}&direction=${sortDirection}`);
      setData(response.data.content);
      setTotalPages(response.data.totalPages);
      setLastPage(response.data.last);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSort = (column) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const formatResponse = (response) => {
    const parsedResponse = JSON.parse(response);
    if (Array.isArray(parsedResponse.response)) {
      return parsedResponse.response.join(', ');
    } else {
      return parsedResponse.response;
    }
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiUrl}/api/v1/challenge/records/${id}`);
      fetchData();
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  }
  const renderSortIcon = (column) => {
    if (column === sortColumn) {
      return sortDirection === 'asc' ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />;
    }
    return <ArrowDropDownIcon style={{ opacity: 0.3 }} />; 
  };

  return (
    <TableContainer component={Paper}>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        padding="20px"
      >
        <TextField
          label="Buscar"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginBottom: '20px' }} 
        />
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell onClick={() => handleSort('operation')}>Operation {renderSortIcon('operation')}</TableCell>
            <TableCell onClick={() => handleSort('username')}>User {renderSortIcon('username')}</TableCell>
            <TableCell onClick={() => handleSort('amount')}>Amount {renderSortIcon('amount')}</TableCell>
            <TableCell onClick={() => handleSort('userBalance')}>User balance {renderSortIcon('userBalance')}</TableCell>
            <TableCell onClick={() => handleSort('operationResponse')}>Operation response {renderSortIcon('operationResponse')}</TableCell>
            <TableCell onClick={() => handleSort('date')}>Date {renderSortIcon('date')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.date}>
              <TableCell>{row.operation}</TableCell>
              <TableCell>{row.username}</TableCell>
              <TableCell>{row.amount}</TableCell>
              <TableCell>{row.userBalance}</TableCell>
              <TableCell>{formatResponse(row.operationResponse)}</TableCell>
              <TableCell>{row.date}</TableCell>
              <TableCell>
                <Button onClick={() => handleDelete(row.id)}>Eliminar</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button disabled={page === 0} onClick={() => setPage(prev => prev - 1)}>Anterior</Button>
      <Button disabled={lastPage} onClick={() => setPage(prev => prev + 1)}>Siguiente</Button>
    </TableContainer>
  );
}

export default RecordsTable;

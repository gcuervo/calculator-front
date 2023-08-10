import React, { useEffect, useState, useContext } from 'react';
import { Typography } from '@mui/material';
import axios from 'axios';
import { AuthContext } from '../auth/AuthProvider';

const PointsBox = ({ refresh }) => {
  const { userId } = useContext(AuthContext);
  const [points, setPoints] = useState(null);
  const apiUrl = process.env.REACT_APP_API_URL;

  const fetchUserPoints = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/v1/challenge/users/${userId}`);
      setPoints(response.data.balance);
    } catch (error) {
      console.error('Error obtaining the points:', error);
    }
  };

  useEffect(() => {
    fetchUserPoints();
  }, [userId, refresh]);

  return (
    <div style={{
      border: '2px solid #3f51b5',
      borderRadius: '5px',
      padding: '20px',
      textAlign: 'center',
    }}>
      <Typography variant="h6">Available points</Typography>
      <Typography variant="h4" style={{ marginTop: '10px' }}>{points}</Typography>
    </div>
  );
};

export default PointsBox;

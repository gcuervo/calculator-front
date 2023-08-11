import React, { useState, useEffect, createContext } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);
  const [username, setUsername] = useState(null);
  const [userId, setUserId] = useState(null);

  const apiUrl = process.env.REACT_APP_API_URL;


  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const storedUsername = localStorage.getItem('username');
    const storedUserId = localStorage.getItem('userId');

    const validateToken = async (token) => {
      try {
        const response = await axios.get(`${apiUrl}/api/v1/challenge/validate-token`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        return response.status === 200;
      } catch (error) {
        return false;
      }
    };

    if (token) {
      validateToken(token).then((isValid) => {
        if (isValid) {
          setAuthToken(token);
          setUsername(storedUsername);
          setUserId(storedUserId);
        }
      });
    }
  }, []);



  const logout = async () => {
    try {
      await axios.post(`${apiUrl}/api/v1/challenge/invalidate-token`);
      localStorage.removeItem('authToken');
      localStorage.removeItem('username');
      localStorage.removeItem('userId');
      window.location = '/login'; 
    } catch (error) {
      console.error("Logout error:", error);
    }
  };


  return (
    <AuthContext.Provider value={{ authToken, setAuthToken, logout, username, setUsername, userId, setUserId }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

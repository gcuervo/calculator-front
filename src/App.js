import './App.css';
import React, { useEffect } from 'react';
import AuthProvider from './auth/AuthProvider';
import AppRouter from './router/AppRouter';
import Axios from 'axios';
import Navbar from './navbar/Navbar';


function App() {


  useEffect(() => {
    const axiosInterceptor = Axios.interceptors.request.use((config) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers['Authorization'] = 'Bearer ' + token;
      }
      return config;
    }, (error) => {
      return Promise.reject(error);
    });

    return () => {
      Axios.interceptors.request.eject(axiosInterceptor);
    };
  }, []);


  return (
    <AuthProvider>
      <Navbar />
      <AppRouter></AppRouter>
    </AuthProvider>
  );
}


export default App;

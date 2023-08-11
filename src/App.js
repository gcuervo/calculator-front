import './App.css';
import React, { useEffect } from 'react';
import AuthProvider from './auth/AuthProvider';
import AppRouter from './router/AppRouter';
import Axios from 'axios';
import Navbar from './navbar/Navbar';
import { useLocation } from 'react-router-dom';


function App() {
  const location = useLocation();


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

  useEffect(() => {
    const interceptor = Axios.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (error.response && error.response.status === 401) {
          if (location.pathname !== '/login') {
            localStorage.removeItem('authToken');
            window.location = '/login'; 
          }
        }
        return Promise.reject(error);
      }
    );
    return () => {
      Axios.interceptors.response.eject(interceptor);
    };

  }, [location.pathname]);


  return (
    <AuthProvider>
      <Navbar />
      <AppRouter></AppRouter>
    </AuthProvider>
  );
}


export default App;

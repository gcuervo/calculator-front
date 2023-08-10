import React, { useContext } from 'react';
import {  Route, Routes, Navigate } from 'react-router-dom';
import { AuthContext } from '../auth/AuthProvider';
import Calculator from '../calculadora/Calculator';
import { SignIn } from '../login/SignIn';
import RecordsTable from '../table/RecordsTable';

const AppRouter = () => {
  const { authToken } = useContext(AuthContext);

  return (

    <Routes>
      <Route path="/login" element={authToken ? <Navigate to="/" /> : <SignIn />} />
      <Route path="/records" element={authToken ? <RecordsTable /> : <Navigate to="/login" />} />
      <Route path="/" element={authToken ? <Calculator /> : <Navigate to="/login" />} />
    </Routes>
  );
};

export default AppRouter;

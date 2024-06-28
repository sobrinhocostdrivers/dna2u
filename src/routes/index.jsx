import React from 'react';
import { Routes, Route} from 'react-router-dom';
import Home from '../screens/home/Home';
import DadosEmpresa from '../screens/dadosEmpresa/DadosEmpresa';

const RoutesComponent = () => {
  return (
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/DadosEmpresa/:cnpj" element={<DadosEmpresa />}/>
    </Routes>
  );
}

export default RoutesComponent;

import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import FlowerCatalog from "../pages/CadastroFlores";
import Inicial from "../pages/Inicial";
import DashboardGerente from "../pages/DashBoardGerente";
import { Notificacoes } from "../pages/Notificações";
import Lotes from "../pages/Lotes";



function RoutesApp() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/Cadastro" element={<FlowerCatalog />} />
      <Route path="/Inicio" element={<Inicial />} />
      <Route path="/dashboard" element={<DashboardGerente />} />
      <Route path="/notificacoes" element={<Notificacoes />} />
      <Route path="/lotes" element={<Lotes />} />
    </Routes>
  );
}

export default RoutesApp;

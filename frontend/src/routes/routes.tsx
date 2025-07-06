import { Navigate, Route, Routes } from "react-router-dom";
import FlowerCatalog from "../pages/CadastroFlores";
import DashboardGerente from "../pages/DashBoardGerente";
import Home from "../pages/Home";
import Inicial from "../pages/Inicial";
import Login from "../pages/Login";
import { Notificacoes } from "../pages/Notificações";
import Register from "../pages/Register";
import MinhasInformacoes from "../pages/MinhasInformacoes";
import GerenciamentoUsuarios from "../pages/Usuario";
import Lotes from "../pages/Lotes";
import Registro from "../pages/RegistrodeFlores";



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
      <Route path="/usuarios" element={<GerenciamentoUsuarios />} />
      <Route path="/meu-perfil" element={<MinhasInformacoes />} />
      <Route path="/lotes" element={<Lotes />} />
      <Route path="/registro" element={<Registro />} />
    </Routes>
  );
}

export default RoutesApp;

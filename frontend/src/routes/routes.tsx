import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import FlowerCatalog from "../pages/CadastroFlores";
import Inicial from "../pages/Inicial";
import DashboardGerente from "../pages/DashBoardGerente";
import { Notificacoes } from "../pages/Notificações";
import Lotes from "../pages/Lotes";
import Registro from "../pages/RegistrodeFlores";
import GerenciamentoUsuarios from "../pages/Usuarios";
import MinhasInformacoes from "../pages/MinhasInformacoes";
import GerenciarTiposProduto from "../pages/GerenciadorTipoProduto";




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
      <Route path="/registro" element={<Registro />} />
      <Route path="/usuarios" element={<GerenciamentoUsuarios />} />
      <Route path="/minhas-informacoes" element={<MinhasInformacoes />} />
      <Route path="/tipo-produto" element={<GerenciarTiposProduto />} />
    
    </Routes>
  );
}

export default RoutesApp;

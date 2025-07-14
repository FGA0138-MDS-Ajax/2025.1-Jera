import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import FlowerCatalog from "../pages/CadastroFlores";
import Inicial from "../pages/Inicial";
import DashboardGerente from "../pages/DashBoardGerente";
import { Notificacoes } from "../pages/Notificacoes";
import Lotes from "../pages/Lotes";
import Registro from "../pages/RegistrodeFlores";
import GerenciamentoUsuarios from "../pages/Usuarios";
import MinhasInformacoes from "../pages/MinhasInformacoes";
import GerenciarTiposProduto from "../pages/GerenciadorTipoProduto";
import HistoricoMovimentacoes from "../pages/historicoMovimentacao";
import ProtectedRoute from "../Components/ProtectedRoute";




function RoutesApp() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Protected routes - require login */}
      <Route path="/Cadastro" element={
        <ProtectedRoute>
          <FlowerCatalog />
        </ProtectedRoute>
      } />
      <Route path="/Inicio" element={
        <ProtectedRoute>
          <Inicial />
        </ProtectedRoute>
      } />
      <Route path="/notificacoes" element={
        <ProtectedRoute>
          <Notificacoes />
        </ProtectedRoute>
      } />
      <Route path="/lotes" element={
        <ProtectedRoute>
          <Lotes />
        </ProtectedRoute>
      } />
      <Route path="/registro" element={
        <ProtectedRoute>
          <Registro />
        </ProtectedRoute>
      } />
      <Route path="/minhas-informacoes" element={
        <ProtectedRoute>
          <MinhasInformacoes />
        </ProtectedRoute>
      } />

      {/* GERENTE level routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute requiredRole="GERENTE">
          <DashboardGerente />
        </ProtectedRoute>
      } />

      {/* ADMINISTRADOR level routes */}
      <Route path="/usuarios" element={
        <ProtectedRoute requiredRole="ADMINISTRADOR">
          <GerenciamentoUsuarios />
        </ProtectedRoute>
      } />
      <Route path="/tipo-produto" element={
        <ProtectedRoute requiredRole="ADMINISTRADOR">
          <GerenciarTiposProduto />
        </ProtectedRoute>
      } />
      <Route path="/historico-movimentacoes" element={
        <ProtectedRoute requiredRole="ADMINISTRADOR">
          <HistoricoMovimentacoes />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default RoutesApp;

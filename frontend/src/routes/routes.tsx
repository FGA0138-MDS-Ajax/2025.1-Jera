import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { lazy, Suspense } from 'react';
import FullPageLoading from "../Components/FullPageLoading";

// Carregamento preguiçoso das páginas
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const Home = lazy(() => import("../pages/Home"));
const Inicial = lazy(() => import("../pages/Inicial"));
const DashboardGerente = lazy(() => import("../pages/DashBoardGerente"));
const Notificacoes = lazy(() => import("../pages/Notificacoes"));
const Lotes = lazy(() => import("../pages/Lotes"));
const Registro = lazy(() => import("../pages/RegistrodeFlores"));
const GerenciamentoUsuarios = lazy(() => import("../pages/Usuarios"));
const MinhasInformacoes = lazy(() => import("../pages/MinhasInformacoes"));
const GerenciarTiposProduto = lazy(() => import("../pages/GerenciadorTipoProduto"));
const HistoricoMovimentacoes = lazy(() => import("../pages/historicoMovimentacao"));
const NotFound = lazy(() => import("../pages/NotFound"));
import { ProtectedRoute } from "../Components/ProtectedRoute";

// Componente para exibir durante o carregamento
const SuspenseFallback = () => <FullPageLoading />;

function AuthLayout() {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <FullPageLoading />;
  }
  
  return isAuthenticated ? <Navigate to="/inicio" replace /> : <Outlet />;
}

function ProtectedLayout() {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <FullPageLoading />;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

function RoutesApp() {
  return (
    <Suspense fallback={<SuspenseFallback />}>
      <Routes>
        {/* Rotas públicas */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Rotas protegidas */}
        <Route element={<ProtectedLayout />}>
          <Route index element={<Navigate to="/inicio" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/inicio" element={<Inicial />} />
          <Route path="/dashboard" element={<DashboardGerente />} />
          <Route path="/notificacoes" element={<Notificacoes />} />
          <Route path="/lotes" element={<Lotes />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/minhas-informacoes" element={<MinhasInformacoes />} />
          <Route path="/tipo-produto" element={<GerenciarTiposProduto />} />
          <Route path="/historico-movimentacoes" element={<HistoricoMovimentacoes />} />
          
          {/* Rotas apenas para administradores */}
          <Route element={<ProtectedRoute allowedRoles={['ADMINISTRADOR']} />}>
            <Route path="/usuarios" element={<GerenciamentoUsuarios />} />
          </Route>
        </Route>

        {/* Rota 404 - Página não encontrada */}
        <Route path="/404" element={<NotFound />} />
        
        {/* Redireciona rotas desconhecidas para 404 */}
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Suspense>
  );
}

export default RoutesApp;

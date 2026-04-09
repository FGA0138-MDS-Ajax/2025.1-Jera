import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'OPERADOR' | 'GERENTE' | 'ADMINISTRADOR';
  redirectTo?: string;
}

const roleHierarchy = {
  'OPERADOR': 1,
  'GERENTE': 2,
  'ADMINISTRADOR': 3
};

export const ProtectedRoute = ({ 
  children, 
  requiredRole = 'OPERADOR', 
  redirectTo = '/login' 
}: ProtectedRouteProps) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('perfil') as keyof typeof roleHierarchy;

  // Check if user is logged in
  if (!token) {
    return <Navigate to={redirectTo} replace />;
  }

  // Check if user has required role
  if (requiredRole && userRole) {
    const userLevel = roleHierarchy[userRole];
    const requiredLevel = roleHierarchy[requiredRole];
    
    if (userLevel < requiredLevel) {
      return <Navigate to="/Inicio" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;

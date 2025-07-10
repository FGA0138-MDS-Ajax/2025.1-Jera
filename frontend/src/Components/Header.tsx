import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="logo">
          <Link to="/inicio">Jera</Link>
        </div>
        <nav className="nav-links">
          <Link to="/inicio">Início</Link>
          <Link to="/lotes">Lotes</Link>
          <Link to="/notificacoes">Notificações</Link>
          <Link to="/minhas-informacoes">Minha Conta</Link>
          {user.perfil === 'ADMINISTRADOR' && (
            <Link to="/usuarios">Usuários</Link>
          )}
        </nav>
        <div className="user-info">
          <span>Olá, {user.nomeUsuario}</span>
          <span className="user-role">{user.perfil.toLowerCase()}</span>
          <button onClick={logout} className="logout-button">Sair</button>
        </div>
      </div>
    </header>
  );
};

export default Header;

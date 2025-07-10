import { Link } from 'react-router-dom';
import '../styles/NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1>404</h1>
        <h2>Página não encontrada</h2>
        <p>Desculpe, a página que você está procurando não existe ou foi movida.</p>
        <Link to="/" className="home-link">
          Voltar para a página inicial
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

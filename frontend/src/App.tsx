import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import RoutesApp from "./routes/routes";
import Header from './Components/Header';
import './styles/Header.css';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app-container">
          <Header />
          <main className="main-content">
            <RoutesApp />
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;

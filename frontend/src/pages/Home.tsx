import { useNavigate } from "react-router-dom";
import "../styles/Home.css";




export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1>Bem-vindo!</h1>
      <div className="home-buttons">
        <button onClick={() => navigate("/register")}>Registrar</button>
        <button onClick={() => navigate("/login")}>Login</button>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import logo from "../assets/Minimalist_and_moder.png";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redireciona se já estiver autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/inicio');
    }
  }, [isAuthenticated, navigate]);

  /* Validação do email */
  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  /* Valida o formulário */
  const validateForm = (email: string, password: string) => {
    const trimmedEmail = email.trim();
    const emailValid = isValidEmail(trimmedEmail);
    const passwordValid = password.length > 0;
    return emailValid && passwordValid;
  };

  /* Atualiza erros e validação em tempo real depois do 1º submit */
  useEffect(() => {
    setIsFormValid(validateForm(email, password));
    
    if (hasSubmitted) {
      const trimmedEmail = email.trim();
      setEmailError(!isValidEmail(trimmedEmail));
    }
  }, [email, password, hasSubmitted]);

  /* Handlers */
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value.trimStart());
    setEmailError(false);
    setLoginError(null);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value.trimStart());
    setLoginError(null);
  };

  /* Submit */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setHasSubmitted(true);

    if (!validateForm(email, password)) return;

    try {
      setIsLoading(true);
      await login(email, password);
      // O redirecionamento ocorrerá automaticamente pelo useEffect
    } catch (error) {
      setLoginError("Credenciais inválidas. Por favor, tente novamente.");
      console.error("Erro no login:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        {/* Botão voltar */}
        <button
          type="button"
          className="back-button"
          onClick={() => navigate("/")}
          disabled={isLoading}
        >
          ←
        </button>

        <img src={logo} alt="Logo" className="login-logo" />
        <h1>Login</h1>

        {/* Mensagem de erro */}
        {loginError && (
          <div className="error-message">
            {loginError}
          </div>
        )}

        {/* Link para registro */}
        <p className="register-link" onClick={() => !isLoading && navigate("/register")}>
          Não tem conta? Cadastre-se
        </p>

        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            className={emailError ? "error" : ""}
            placeholder="Email"
            disabled={isLoading}
          />
          {emailError && <span className="error-message">Email inválido</span>}
        </label>

        <label>
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Senha"
            disabled={isLoading}
          />
        </label>

        <button 
          type="submit" 
          disabled={!isFormValid || isLoading}
          className={!isFormValid || isLoading ? 'disabled' : ''}
        >
          {isLoading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
};

export default Login;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import logo from "../assets/Minimalist_and_moder.png";

const Login = () => {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const navigate = useNavigate();

  // atualizar estado da usuário
  const handleUserChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUser(event.target.value.trimStart());
    setEmailError(false);
    setLoginError(false);
  };

  // atualizar estado da senha
  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value.trimStart());
    setLoginError(false);
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const isEmail = user.includes("@");

    if (isEmail && !isValidEmail(user.trim())) {
      setEmailError(true);
      setLoginError(false);
      return;
    }

    const validUsers = ["admin", "admin@email.com"];
    const validPassword = "123";

    if (
      validUsers.includes(user.trim().toLowerCase()) &&
      password === validPassword
    ) {
      setLoginError(false);
      setEmailError(false);
      navigate("/home");
    } else {
      setLoginError(true);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <img src={logo} alt="Logo" className="login-logo" />
        <h1>Login</h1>

        <label>
          Usuário ou Email:
          <input
            type="text"
            value={user}
            onChange={handleUserChange}
            placeholder="Digite seu usuário ou email"
            required
          />
        </label>

        {emailError && (
          <div className="login-error">Por favor, insira um email válido.</div>
        )}

        <label>
          Senha:
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Digite sua senha"
            required
          />
        </label>

        {loginError && !emailError && (
          <div className="login-error">Usuário/email ou senha incorretos.</div>
        )}

        <button type="submit" disabled={emailError}>
          Entrar
        </button>
      </form>
    </div>
  );
};

export default Login;

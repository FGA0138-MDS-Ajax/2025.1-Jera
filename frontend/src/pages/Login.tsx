import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import logo from "../assets/Minimalist_and_moder.png";
import { useApiErrorHandler } from "../utils/apiErrorHandler";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isFormValid, setIsFormValid] = useState(true);

  const navigate = useNavigate();
  const { handleApiError, handleSuccess } = useApiErrorHandler();

  /* Validação do email */
  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  /* Valida o formulário */
  const validateForm = () => {
    const trimmedEmail = email.trim();
    const emailValid = isValidEmail(trimmedEmail);
    const passwordValid = password.length > 0;
    return emailValid && passwordValid;
  };

  /* Atualiza erros e validação em tempo real depois do 1º submit */
  useEffect(() => {
    if (hasSubmitted) {
      const trimmedEmail = email.trim();
      const emailValid = isValidEmail(trimmedEmail);

      setEmailError(!emailValid);
      setIsFormValid(emailValid && password.length > 0);
    }
  }, [email, password, hasSubmitted]);

  /* Handlers */
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value.trimStart());
    setEmailError(false);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value.trimStart());
  };

  /* Submit */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!hasSubmitted) setHasSubmitted(true);

    if (!validateForm()) return;

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha: password }),
      });

      await handleApiError(res);
      
      const data = await res.json();
      localStorage.setItem("token", data.access_token);

      // Decodifique o token para pegar o perfil (opcional)
      const payload = JSON.parse(atob(data.access_token.split(".")[1]));
      localStorage.setItem("perfil", payload.perfil);
      localStorage.setItem("idUsuario", payload.idUsuario);

      handleSuccess("Login realizado com sucesso!");
      navigate("/inicio");
    } catch (error) {
      console.error("Login error:", error);
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
        >
          ←
        </button>

        <img src={logo} alt="Logo" className="login-logo" />
        <h1>Login</h1>

        {/* Link para registro */}
        <p className="register-link" onClick={() => navigate("/register")}>
          Não tem conta? Cadastre-se
        </p>

        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Digite seu email"
            required
          />
        </label>

        {hasSubmitted && emailError && (
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

        <button type="submit" disabled={hasSubmitted && !isFormValid}>
          Entrar
        </button>
      </form>
    </div>
  );
};

export default Login;

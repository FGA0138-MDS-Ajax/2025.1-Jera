import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Register.css";
import logo from "../assets/Minimalist_and_moder.png";

/* ------------ Função auxiliar de validação ------------ */
const validateFields = (
  name: string,
  email: string,
  password: string,
  confirmPassword: string
) => {
  const errors: { [key: string]: string } = {};

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isStrongPassword =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password) ||
    /^(?=.*[a-zA-Z])(?=.*\d).{6,}$/.test(password);

  if (!name.trim()) errors.name = "Nome é obrigatório.";
  if (!isValidEmail) errors.email = "Email inválido.";
  if (email.toLowerCase() === "teste@gmail.com")
    errors.email = "Este email já está cadastrado.";
  if (!isStrongPassword)
    errors.password =
      "Senha fraca. Use letras, números e ao menos 6 caracteres.";
  if (password !== confirmPassword)
    errors.confirmPassword = "As senhas não coincidem.";

  return errors;
};

const Register = () => {
  /* ------------ Estados ------------ */
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [hasSubmitted, setHasSubmitted] = useState(false); // <-- controla 1ª tentativa
  const [isFormValid, setIsFormValid] = useState(true); // começa habilitado

  const navigate = useNavigate();

  /* ------------ Validação em tempo real só DEPOIS do submit ------------ */
  useEffect(() => {
    if (hasSubmitted) {
      const newErrors = validateFields(name, email, password, confirmPassword);
      setErrors(newErrors);
      setIsFormValid(Object.keys(newErrors).length === 0);
    }
  }, [name, email, password, confirmPassword, hasSubmitted]);

  /* ------------ Submit ------------ */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!hasSubmitted) setHasSubmitted(true); // marca que houve tentativa

    const newErrors = validateFields(name, email, password, confirmPassword);
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      navigate("/Inicio");
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <button
          type="button"
          className="back-button"
          onClick={() => navigate("/")}
        >
          ←
        </button>

        <img src={logo} alt="Logo" className="register-logo" />
        <h1>Cadastro</h1>

        <p className="login-link" onClick={() => navigate("/login")}>
          Já tem uma conta? Faça login
        </p>

        {/* ---------- Nome ---------- */}
        <label>
          Nome do Usuário:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Digite seu nome"
            required
          />
        </label>
        {hasSubmitted && errors.name && (
          <div className="register-error">{errors.name}</div>
        )}

        {/* ---------- Email ---------- */}
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Digite seu email"
            required
          />
        </label>
        {hasSubmitted && errors.email && (
          <div className="register-error">{errors.email}</div>
        )}

        {/* ---------- Senha ---------- */}
        <label>
          Senha:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Digite uma senha"
            required
          />
        </label>
        {hasSubmitted && errors.password && (
          <div className="register-error">{errors.password}</div>
        )}

        {/* ---------- Confirmar Senha ---------- */}
        <label>
          Confirmar Senha:
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirme sua senha"
            required
          />
        </label>
        {hasSubmitted && errors.confirmPassword && (
          <div className="register-error">{errors.confirmPassword}</div>
        )}

        {/* ---------- Botão de envio ---------- */}
        <button type="submit" disabled={hasSubmitted && !isFormValid}>
          Cadastrar
        </button>
      </form>
    </div>
  );
};

export default Register;

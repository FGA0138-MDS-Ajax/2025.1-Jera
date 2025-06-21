import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Register.css";
import logo from "../assets/Minimalist_and_moder.png";

const Register = () => {
  const [userId, setUserId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isStrongPassword = (pwd: string) => {
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    const mediumRegex = /^(?=.*[a-zA-Z])(?=.*\d).{6,}$/;
    return strongRegex.test(pwd) || mediumRegex.test(pwd);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!userId.trim()) newErrors.userId = "ID do usuário é obrigatório.";
    if (!name.trim()) newErrors.name = "Nome é obrigatório.";
    if (!isValidEmail(email)) newErrors.email = "Email inválido.";
    if (email !== confirmEmail)
      newErrors.confirmEmail = "Os emails não coincidem.";
    if (!isStrongPassword(password))
      newErrors.password =
        "Senha fraca. Use letras, números e ao menos 6 caracteres.";
    if (password !== confirmPassword)
      newErrors.confirmPassword = "As senhas não coincidem.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      navigate("/home");
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <img src={logo} alt="Logo" className="register-logo" />
        <h1>Cadastro</h1>

        <label>
          ID do Usuário:
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Digite o ID"
            required
          />
        </label>
        {errors.userId && <div className="register-error">{errors.userId}</div>}

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
        {errors.name && <div className="register-error">{errors.name}</div>}

        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors((prev) => ({ ...prev, email: "" }));
            }}
            placeholder="Digite seu email"
            required
          />
        </label>
        {errors.email && <div className="register-error">{errors.email}</div>}

        <label>
          Confirmar Email:
          <input
            type="email"
            value={confirmEmail}
            onChange={(e) => {
              setConfirmEmail(e.target.value);
              setErrors((prev) => ({ ...prev, confirmEmail: "" }));
            }}
            placeholder="Confirme seu email"
            required
          />
        </label>
        {errors.confirmEmail && (
          <div className="register-error">{errors.confirmEmail}</div>
        )}

        <label>
          Senha:
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors((prev) => ({ ...prev, password: "" }));
            }}
            placeholder="Digite uma senha"
            required
          />
        </label>
        {errors.password && (
          <div className="register-error">{errors.password}</div>
        )}

        <label>
          Confirmar Senha:
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setErrors((prev) => ({ ...prev, confirmPassword: "" }));
            }}
            placeholder="Confirme sua senha"
            required
          />
        </label>
        {errors.confirmPassword && (
          <div className="register-error">{errors.confirmPassword}</div>
        )}

        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
};

export default Register;

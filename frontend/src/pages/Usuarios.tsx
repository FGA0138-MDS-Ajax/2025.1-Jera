import React, { useState, useEffect } from "react";
import "../styles/Usuarios.css";
import Navbar from "../Components/Navebar";

interface User {
  id: number;
  nome: string;
  email: string;
  cargo: "Funcionário" | "Gerente" | "Administrador";
}

const cargos = ["Funcionário", "Gerente", "Administrador"] as const;

const GerenciamentoUsuarios: React.FC = () => {
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [loading,] = useState<boolean>(false);
  const [error,] = useState<string | null>(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [novoNome, setNovoNome] = useState("");
  const [novoEmail, setNovoEmail] = useState("");
  const [novoCargo, setNovoCargo] = useState<User["cargo"]>("Funcionário");

  useEffect(() => {
    // Futuro fetch de usuários
  }, []);

  const handleCargoChange = (id: number, novoCargo: User["cargo"]) => {
    setUsuarios((prev) =>
      prev.map((user) =>
        user.id === id ? { ...user, cargo: novoCargo } : user
      )
    );
    console.log(`Cargo do usuário ${id} alterado para ${novoCargo}`);
  };

  const handleExcluir = (id: number) => {
    if (!window.confirm("Deseja excluir este usuário?")) return;
    setUsuarios((prev) => prev.filter((user) => user.id !== id));
    console.log(`Usuário ${id} excluído`);
  };

  const handleAdicionarUsuario = () => {
    const novoUsuario: User = {
      id: Date.now(),
      nome: novoNome.trim(),
      email: novoEmail.trim(),
      cargo: novoCargo,
    };
    setUsuarios((prev) => [...prev, novoUsuario]);
    setNovoNome("");
    setNovoEmail("");
    setNovoCargo("Funcionário");
    setShowAddModal(false);
    console.log("Novo usuário criado:", novoUsuario);
  };

  if (loading) return <p>Carregando usuários...</p>;
  if (error) return <p>Erro: {error}</p>;

  return (
    <>
      <Navbar title="Gerenciamento de Usuários" />

      <div className="usuarios-container">
        <h1>Gerenciamento de Usuários</h1>

        <button className="btn-adicionar" onClick={() => setShowAddModal(true)}>
          + Adicionar Usuário
        </button>

        <div className="tabela-wrapper">
          <table className="usuarios-tabela">
            <thead>
              <tr>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Cargo</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    style={{ textAlign: "center", fontStyle: "italic" }}
                  >
                    Nenhum usuário encontrado.
                  </td>
                </tr>
              ) : (
                usuarios.map((user) => (
                  <tr key={user.id}>
                    <td data-label="Nome">{user.nome}</td>
                    <td data-label="E-mail">{user.email}</td>
                    <td data-label="Cargo">
                      <select
                        value={user.cargo}
                        onChange={(e) =>
                          handleCargoChange(
                            user.id,
                            e.target.value as User["cargo"]
                          )
                        }
                      >
                        {cargos.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td data-label="Ações">
                      <button
                        className="btn-excluir"
                        onClick={() => handleExcluir(user.id)}
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h2>Novo Usuário</h2>

            <input
              type="text"
              placeholder="Nome"
              value={novoNome}
              onChange={(e) => setNovoNome(e.target.value)}
            />

            <input
              type="email"
              placeholder="E-mail"
              value={novoEmail}
              onChange={(e) => setNovoEmail(e.target.value)}
            />

            <select
              value={novoCargo}
              onChange={(e) => setNovoCargo(e.target.value as User["cargo"])}
            >
              {cargos.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            {(() => {
              const nomeValido = novoNome.trim().length > 0;
              const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                novoEmail.trim()
              );
              const formValido = nomeValido && emailValido;

              return (
                <>
                  {!nomeValido && (
                    <p
                      style={{
                        color: "red",
                        fontSize: "0.8rem",
                        margin: "0 0 4px 0",
                      }}
                    >
                      O nome é obrigatório.
                    </p>
                  )}
                  {!emailValido && novoEmail.trim().length > 0 && (
                    <p
                      style={{
                        color: "red",
                        fontSize: "0.8rem",
                        margin: "0 0 4px 0",
                      }}
                    >
                      Informe um e-mail válido.
                    </p>
                  )}

                  <div className="modal-actions">
                    <button
                      className="btn-confirmar"
                      onClick={handleAdicionarUsuario}
                      disabled={!formValido}
                    >
                      Adicionar
                    </button>
                    <button
                      className="btn-cancelar"
                      onClick={() => setShowAddModal(false)}
                    >
                      Cancelar
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </>
  );
};

export default GerenciamentoUsuarios;

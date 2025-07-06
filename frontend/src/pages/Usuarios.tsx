import React, { useState, useEffect } from "react";
import "../styles/Usuarios.css";
import Navbar from "../Components/Navebar";

interface User {
  id: number;
  nome: string;
  permissao: "Funcionário" | "Gerente" | "Administrador";
}

const permissoes = ["Funcionário", "Gerente", "Administrador"] as const;

const GerenciamentoUsuarios: React.FC = () => {
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Preparado para futuro fetch, mas está desabilitado por enquanto
    /*
    const fetchUsuarios = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/usuarios");
        if (!response.ok) throw new Error("Erro ao buscar usuários");
        const data: User[] = await response.json();
        setUsuarios(data);
        setError(null);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsuarios();
    */
  }, []);

  const handlePermissaoChange = (
    id: number,
    novaPermissao: User["permissao"]
  ) => {
    setUsuarios((prev) =>
      prev.map((user) =>
        user.id === id ? { ...user, permissao: novaPermissao } : user
      )
    );
    console.log(
      `Permissão do usuário de id ${id} alterada para ${novaPermissao}.`
    );
  };

  const handleExcluir = (id: number) => {
    const confirmDelete = window.confirm(
      `Você tem certeza que deseja excluir o usuário de id ${id}? Esta ação não pode ser desfeita.`
    );

    if (!confirmDelete) return;

    setUsuarios((prev) => prev.filter((user) => user.id !== id));
    console.log(`Usuário de id ${id} excluído com sucesso.`);
  };

  if (loading) return <p>Carregando usuários...</p>;
  if (error) return <p>Erro: {error}</p>;

  return (
    <>
      <Navbar title="Gerenciamento de Usuários" />

      <div className="usuarios-container">
        <h1>Gerenciamento de Usuários</h1>
        <table className="usuarios-tabela">
          <thead>
            <tr>
              <th>Nome do Funcionário</th>
              <th>Nível de Permissão</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  style={{ textAlign: "center", fontStyle: "italic" }}
                >
                  Nenhum usuário encontrado.
                </td>
              </tr>
            ) : (
              usuarios.map((user) => (
                <tr key={user.id}>
                  <td>{user.nome}</td>
                  <td>
                    <select
                      value={user.permissao}
                      onChange={(e) =>
                        handlePermissaoChange(
                          user.id,
                          e.target.value as User["permissao"]
                        )
                      }
                    >
                      {permissoes.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
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
    </>
  );
};

export default GerenciamentoUsuarios;

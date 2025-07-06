
import React, { useState } from "react";
import "../styles/Usuario.css";


// Tipagem do usuário (agora com nome)
interface User {
  id: number;
  nome: string;
  permissao: "Funcionário" | "Gerente" | "Administrador";
}

// Permissões possíveis
const permissoes = ["Funcionário", "Gerente", "Administrador"] as const;

// Dados mockados para prototipagem (agora com nome)
const usuariosMock: User[] = [
  { id: 1, nome: "Ana Souza", permissao: "Funcionário" },
  { id: 2, nome: "Bruno Lima", permissao: "Gerente" },
  { id: 3, nome: "Carla Dias", permissao: "Administrador" },
  { id: 4, nome: "Diego Alves", permissao: "Funcionário" },
];

const GerenciamentoUsuarios: React.FC = () => {
  // Estado local dos usuários
  const [usuarios, setUsuarios] = useState<User[]>(usuariosMock);

  // Handler para alteração de permissão
  const handlePermissaoChange = (id: number, novaPermissao: User["permissao"]) => {
    setUsuarios((prev: User[]) =>
      prev.map((user: User) =>
        user.id === id ? { ...user, permissao: novaPermissao } : user
      )
    );
    console.log(
      `Permissão do usuário de id ${id} alterada para ${novaPermissao}.`
    );
  };

  // Handler para exclusão de usuário
  const handleExcluir = (id: number) => {
    const confirm = window.confirm(
      `Você tem certeza que deseja excluir o usuário de id ${id}? Esta ação não pode ser desfeita.`
    );
    if (confirm) {
      setUsuarios((prev: User[]) => prev.filter((user: User) => user.id !== id));
      console.log(`Usuário de id ${id} excluído com sucesso.`);
    }
  };

  return (
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
          {usuarios.map((user: User) => (
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
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GerenciamentoUsuarios;
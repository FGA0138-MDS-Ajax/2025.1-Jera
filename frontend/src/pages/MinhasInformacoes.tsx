import React from 'react';
import '../styles/MinhasInformacoes.css';

interface InformacoesUsuario {
  nome: string;
  email: string;
  telefone: string;
  permissao: string;
}

const usuarioMock: InformacoesUsuario = {
  nome: 'Carlos Pereira',
  email: 'carlos.pereira@email.com',
  telefone: '(11) 91234-5678',
  permissao: 'Gerente',
};


const MinhasInformacoes: React.FC = () => {
  const handleVoltar = () => {
    window.history.length > 1 ? window.history.back() : console.log('Ação de voltar acionada');
  };

  return (
    <div className="pagina-perfil">
      <div className="perfil-container">
        <button className="voltar-btn" onClick={handleVoltar}>
          &#8592; Voltar
        </button>
        <h1 className="perfil-titulo">Meu Perfil</h1>
        <div className="perfil-secao">
          <h3 className="perfil-subtitulo">Dados Pessoais</h3>
          <div className="perfil-item">
            <strong className="perfil-label">Nome Completo:</strong>
            <span className="perfil-valor">{usuarioMock.nome}</span>
          </div>
          <div className="perfil-item">
            <strong className="perfil-label">Email:</strong>
            <span className="perfil-valor">{usuarioMock.email}</span>
          </div>
          <div className="perfil-item">
            <strong className="perfil-label">Telefone:</strong>
            <span className="perfil-valor">{usuarioMock.telefone}</span>
          </div>
        </div>
        <div className="perfil-secao">
          <h3 className="perfil-subtitulo">Informações Corporativas</h3>
          <div className="perfil-item">
            <strong className="perfil-label">Função (Cargo):</strong>
            <span className="perfil-valor">{usuarioMock.permissao}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MinhasInformacoes;

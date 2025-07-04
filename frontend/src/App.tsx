import React, { useState } from 'react';
import './App.css';

// Tipos para os lotes
type EstadoFlor = 'Ótimo' | 'Regular' | 'Ruim';
type StatusLote = 'Ativo' | 'Concluído';

interface Lote {
  id: number;
  flor: string;
  quantidade: number;
  estado: EstadoFlor;
  status: StatusLote;
}

const LOTES_MOCK: Lote[] = [
  { id: 123, flor: 'Rosa Vermelha', quantidade: 37, estado: 'Ótimo', status: 'Ativo' },
  { id: 108, flor: 'Lírio Branco', quantidade: 0, estado: 'Regular', status: 'Concluído' },
  { id: 124, flor: 'Tulipa Rosa', quantidade: 15, estado: 'Regular', status: 'Ativo' },
  { id: 125, flor: 'Girassol', quantidade: 5, estado: 'Ruim', status: 'Ativo' },
];

interface ModalNovoLoteProps {
  onClose: () => void;
  onCriar: (lote: { identificador: string; flor: string }) => void;
}
function ModalNovoLote({ onClose, onCriar }: ModalNovoLoteProps) {
  const [identificador, setIdentificador] = useState('');
  const [flor, setFlor] = useState('');
  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-header">
          <h4>Registrar Novo Lote</h4>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <label>Identificador do Lote</label>
          <input placeholder="Ex: Lote #126" value={identificador} onChange={e => setIdentificador(e.target.value)} />
          <label style={{marginTop:8}}>Tipo de Flor para o Lote</label>
          <input placeholder="Ex: Rosa Vermelha" value={flor} onChange={e => setFlor(e.target.value)} />
          <button className="btn-novo-lote" style={{marginTop:16}} onClick={() => {onCriar({identificador, flor}); onClose();}}>Criar Lote</button>
        </div>
      </div>
    </div>
  );
}

interface ModalDetalhesLoteProps {
  lote: Lote;
  onClose: () => void;
  onAtualizar: (dados: { id: number; quantidade: number | string; estado: EstadoFlor }) => void;
}
function ModalDetalhesLote({ lote, onClose, onAtualizar }: ModalDetalhesLoteProps) {
  const [aba, setAba] = useState<'quantidade' | 'estado'>('quantidade');
  const [quantidade, setQuantidade] = useState<number>(lote.quantidade);
  const [estado, setEstado] = useState<EstadoFlor>(lote.estado);
  const [quantidadeAtualizar, setQuantidadeAtualizar] = useState('');
  const [novoEstado, setNovoEstado] = useState<EstadoFlor>(lote.estado);
  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-header">
          <h4>Detalhes do Lote</h4>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-subheader">
          <span style={{fontWeight:600}}>Lote #{lote.id} - {lote.flor}</span>
        </div>
        <div className="modal-tabs">
          <button className={aba==='quantidade'? 'tab-active':''} onClick={()=>setAba('quantidade')}>Ajustar Quantidade</button>
          <button className={aba==='estado'? 'tab-active':''} onClick={()=>setAba('estado')}>Atualizar Estado</button>
        </div>
        <div className="modal-body">
          {aba==='quantidade' ? (
            <>
              <label>Quantidade</label>
              <div className="quantidade-ajuste">
                <button onClick={()=>setQuantidade(q=>Math.max(0,q-1))}>-</button>
                <input type="number" value={quantidade} readOnly />
                <button onClick={()=>setQuantidade(q=>q+1)}>+</button>
              </div>
              <label style={{marginTop:8}}>Estado das flores</label>
              <div className="estado-opcoes">
                <button className={estado==='Ótimo'? 'estado-btn ativo':'estado-btn'} onClick={()=>setEstado('Ótimo')}>Ótimo</button>
                <button className={estado==='Regular'? 'estado-btn ativo':'estado-btn'} onClick={()=>setEstado('Regular')}>Regular</button>
                <button className={estado==='Ruim'? 'estado-btn ativo':'estado-btn'} onClick={()=>setEstado('Ruim')}>Ruim</button>
              </div>
              <button className="btn-novo-lote" style={{marginTop:16}} onClick={()=>{onAtualizar({id:lote.id, quantidade, estado}); onClose();}}>Confirmar</button>
            </>
          ) : (
            <>
              <label>Quantidade a atualizar</label>
              <input placeholder="Ex: 5" value={quantidadeAtualizar} onChange={e=>setQuantidadeAtualizar(e.target.value)} />
              <label style={{marginTop:8}}>Novo estado</label>
              <div className="estado-opcoes">
                <button className={novoEstado==='Ótimo'? 'estado-btn ativo':'estado-btn'} onClick={()=>setNovoEstado('Ótimo')}>Ótimo</button>
                <button className={novoEstado==='Regular'? 'estado-btn ativo':'estado-btn'} onClick={()=>setNovoEstado('Regular')}>Regular</button>
                <button className={novoEstado==='Ruim'? 'estado-btn ativo':'estado-btn'} onClick={()=>setNovoEstado('Ruim')}>Ruim</button>
              </div>
              <button className="btn-novo-lote" style={{marginTop:16}} onClick={()=>{onAtualizar({id:lote.id, quantidade:quantidadeAtualizar, estado:novoEstado}); onClose();}}>Confirmar Atualização</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function App() {
  const [modalNovoLote, setModalNovoLote] = useState(false);
  const [modalDetalhes, setModalDetalhes] = useState<Lote | null>(null);
  const [lotes, setLotes] = useState<Lote[]>(LOTES_MOCK);

  return (
    <div className="gestao-lotes-container">
      {/* Header */}
      <header className="header">
        <button className="menu-btn">☰</button>
        <h2>Gestão de Lotes</h2>
        <div className="header-actions">
          <button className="notif-btn">🔔</button>
          <div className="user-circle">O</div>
        </div>
      </header>
      {/* Conteúdo principal */}
      <main className="main-content">
        <h3 className="titulo">Lotes Registrados</h3>
        <button className="btn-novo-lote" onClick={() => setModalNovoLote(true)}>
          + Registrar Novo Lote
        </button>
        {/* Filtros */}
        <section className="filtros">
          <input placeholder="Nome da flor do lote..." />
          <select>
            <option>Todos</option>
            <option>Ótimo</option>
            <option>Regular</option>
            <option>Ruim</option>
          </select>
          <select>
            <option>Todos</option>
            <option>Ativo</option>
            <option>Concluído</option>
          </select>
        </section>
        {/* Lista de Lotes */}
        <section className="lista-lotes">
          {lotes.map(lote => (
            <div key={lote.id} className={`card-lote ${lote.status === 'Concluído' ? 'arquivado' : ''}`}>
              <div className="lote-header">
                <span className="lote-id">Lote #{lote.id}</span>
                <span className={`status ${lote.status === 'Ativo' ? 'ativo' : 'concluido'}`}>{lote.status}</span>
              </div>
              <div className="lote-flor" style={{ color: lote.flor === 'Rosa Vermelha' ? '#a0522d' : lote.flor === 'Tulipa Rosa' ? '#b87333' : lote.flor === 'Girassol' ? '#b8860b' : '#888' }}>{lote.flor}</div>
              <div className="lote-info">
                <span>Quantidade: <b>{lote.quantidade} flores</b></span>
                <span>Estado Médio: <b className={`estado ${lote.estado.toLowerCase()}`}>{lote.estado}</b></span>
              </div>
              {lote.status === 'Concluído' ? (
                <button className="btn-arquivado" disabled>Arquivado</button>
              ) : (
                <button className="btn-detalhes" onClick={() => setModalDetalhes(lote)}>Ver Detalhes</button>
              )}
            </div>
          ))}
        </section>
      </main>
      {/* Modais */}
      {modalNovoLote && (
        <ModalNovoLote onClose={()=>setModalNovoLote(false)} onCriar={(novo)=>{
          setLotes(lotes=>[...lotes, {id: Math.floor(Math.random()*1000), flor: novo.flor, quantidade: 0, estado: 'Ótimo', status: 'Ativo'}]);
        }} />
      )}
      {modalDetalhes && (
        <ModalDetalhesLote lote={modalDetalhes} onClose={()=>setModalDetalhes(null)} onAtualizar={({id, quantidade, estado})=>{
          setLotes(lotes=>lotes.map(l=>l.id===id? {...l, quantidade: quantidade!==''? Number(quantidade):l.quantidade, estado: estado||l.estado}:l));
        }} />
      )}
    </div>
  );
}

export default App; 
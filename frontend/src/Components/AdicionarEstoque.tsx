import { useState } from 'react';
import './AdicionarEstoque.css';

export default function AdicionarEstoque() {
  const [quantidade, setQuantidade] = useState(1);
  const [estado, setEstado] = useState<'Ótimo' | 'Bom' | 'Ruim'>('Ótimo');

  return (
    <div className="adicionar-estoque">
      <h2>Adicionar Estoque</h2>
      <div className="nome-flor">Rosa Vermelha</div>
      <div className="campo">
        <label>Quantidade</label>
        <div className="quantidade-box">
          <button onClick={() => setQuantidade(q => Math.max(1, q - 1))}>-</button>
          <span>{quantidade}</span>
          <button onClick={() => setQuantidade(q => q + 1)}>+</button>
        </div>
      </div>
      <div className="campo">
        <label>Estado</label>
        <div className="estado-box">
          <button className={estado === 'Ótimo' ? 'ativo' : ''} onClick={() => setEstado('Ótimo')}>Ótimo</button>
          <button className={estado === 'Bom' ? 'ativo' : ''} onClick={() => setEstado('Bom')}>Bom</button>
          <button className={estado === 'Ruim' ? 'ativo' : ''} onClick={() => setEstado('Ruim')}>Ruim</button>
        </div>
      </div>
      <button className="btn-confirmar">Confirmar Adição</button>
    </div>
  );
} 
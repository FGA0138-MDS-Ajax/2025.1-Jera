import './DetalhesFlor.css';

export default function DetalhesFlor() {
  return (
    <div className="detalhes-flor">
      <h1 className="titulo">Rosa Vermelha</h1>
      <div className="info-row">
        <span><b>Tipo:</b> Tropical</span>
        <span><b>Categoria:</b> Flor</span>
      </div>
      <div className="info-row">
        <span><b>Estoque Mínimo:</b> 20 unidades</span>
        <span><b>Estoque Máximo:</b> 150 unidades</span>
      </div>
      <div className="validade-box">
        <b>Data de Validade</b>
        <ul>
          <li><span className="dot otimo" /> Ótimo - 7 dias</li>
          <li><span className="dot bom" /> Bom - 5 dias</li>
          <li><span className="dot ruim" /> Ruim - 3 dias</li>
        </ul>
      </div>
      <button className="btn-adicionar">+ Adicionar</button>
    </div>
  );
} 
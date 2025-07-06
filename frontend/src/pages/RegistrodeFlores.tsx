import React, { useState } from "react";
import "../styles/RegistrodeFlores.css";

export default function Registro() {
  const [quantidade, setQuantidade] = useState(1);
  const [estado, setEstado] = useState<"Ótimo" | "Bom" | "Ruim">("Ótimo");

  return (
    <div className="container-flor">
      {/* Detalhes da Flor */}
      <div className="detalhes-flor">
        <h1 className="titulo">Rosa Vermelha</h1>
        <div className="info-row">
          <span>
            <b>Tipo:</b> Tropical
          </span>
          <span>
            <b>Categoria:</b> Flor
          </span>
        </div>
        <div className="info-row">
          <span>
            <b>Estoque Mínimo:</b> 20 unidades
          </span>
          <span>
            <b>Estoque Máximo:</b> 150 unidades
          </span>
        </div>
        <div className="validade-box">
          <b>Data de Validade</b>
          <ul>
            <li>
              <span className="dot otimo" /> Ótimo - 7 dias
            </li>
            <li>
              <span className="dot bom" /> Bom - 5 dias
            </li>
            <li>
              <span className="dot ruim" /> Ruim - 3 dias
            </li>
          </ul>
        </div>
        <button className="btn-adicionar">+ Adicionar</button>
      </div>

      {/* Adicionar Estoque */}
      <div className="adicionar-estoque">
        <h2>Adicionar Estoque</h2>
        <div className="nome-flor">Rosa Vermelha</div>
        <div className="campo">
          <label>Quantidade</label>
          <div className="quantidade-box">
            <button onClick={() => setQuantidade((q) => Math.max(1, q - 1))}>
              -
            </button>
            <span>{quantidade}</span>
            <button onClick={() => setQuantidade((q) => q + 1)}>+</button>
          </div>
        </div>
        <div className="campo">
          <label>Estado</label>
          <div className="estado-box">
            <button
              className={estado === "Ótimo" ? "ativo" : ""}
              onClick={() => setEstado("Ótimo")}
            >
              Ótimo
            </button>
            <button
              className={estado === "Bom" ? "ativo" : ""}
              onClick={() => setEstado("Bom")}
            >
              Bom
            </button>
            <button
              className={estado === "Ruim" ? "ativo" : ""}
              onClick={() => setEstado("Ruim")}
            >
              Ruim
            </button>
          </div>
        </div>
        <button className="btn-confirmar">Confirmar Adição</button>
      </div>
    </div>
  );
}

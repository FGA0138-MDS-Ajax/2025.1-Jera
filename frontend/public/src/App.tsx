import React, { useState } from 'react';
import './App.css';
import Explore from './components/Explore';
import DetalhesFlor from './components/DetalhesFlor';
import AdicionarEstoque from './components/AdicionarEstoque';

// Enum para as telas
enum Tela {
  Explore = 'Explore',
  DetalhesFlor = 'DetalhesFlor',
  AdicionarEstoque = 'AdicionarEstoque',
}

export default function App() {
  const [tela, setTela] = useState<Tela>(Tela.Explore);

  return (
    <div className="app-container">
      <main className="main-content">
        {tela === Tela.Explore && <Explore />}
        {tela === Tela.DetalhesFlor && <DetalhesFlor />}
        {tela === Tela.AdicionarEstoque && <AdicionarEstoque />}
      </main>
      <nav className="bottom-nav">
        <button onClick={() => setTela(Tela.Explore)} className={tela === Tela.Explore ? 'active' : ''}>Explore</button>
        <button onClick={() => setTela(Tela.DetalhesFlor)} className={tela === Tela.DetalhesFlor ? 'active' : ''}>DetalhesFlor</button>
        <button onClick={() => setTela(Tela.AdicionarEstoque)} className={tela === Tela.AdicionarEstoque ? 'active' : ''}>AdicionarEstoque</button>
      </nav>
    </div>
  );
} 
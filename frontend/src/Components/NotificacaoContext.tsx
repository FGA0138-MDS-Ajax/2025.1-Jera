import React, { createContext, useContext, useState } from "react";

export const NotificacaoContext = createContext<{
  quantidade: number;
  setQuantidade: (q: number) => void;
  atualizarQuantidade: () => Promise<void>;
}>({
  quantidade: 0,
  setQuantidade: () => {},
  atualizarQuantidade: async () => {},
});

export const useNotificacao = () => useContext(NotificacaoContext);

export const NotificacaoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [quantidade, setQuantidade] = useState(0);

  // Função para buscar a quantidade de alertas do backend
  const atualizarQuantidade = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/alert", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setQuantidade(data.length);
    } catch {
      setQuantidade(0);
    }
  };

  return (
    <NotificacaoContext.Provider value={{ quantidade, setQuantidade, atualizarQuantidade }}>
      {children}
    </NotificacaoContext.Provider>
  );
};
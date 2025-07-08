import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { NotificacaoProvider } from "./Components/NotificacaoContext";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <NotificacaoProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </NotificacaoProvider>
  </React.StrictMode>
);
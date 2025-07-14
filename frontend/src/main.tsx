import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { NotificacaoProvider } from "./Components/NotificacaoContext";
import { ToastProvider } from "./Components/Toast";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ToastProvider>
      <NotificacaoProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </NotificacaoProvider>
    </ToastProvider>
  </React.StrictMode>
);
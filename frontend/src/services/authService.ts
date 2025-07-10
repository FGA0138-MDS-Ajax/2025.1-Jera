const API_URL = 'http://localhost:8000';

export interface LoginResponse {
  access_token: string;
  token_type: string;
  perfil: string;
}

export const login = async (email: string, senha: string): Promise<LoginResponse> => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, senha }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Falha na autenticação');
  }

  return response.json();
};

export const getCurrentUser = async (token: string) => {
  const response = await fetch(`${API_URL}/usuario/me`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Falha ao obter informações do usuário');
  }

  return response.json();
};

export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('token');
  return !!token;
};

export const logout = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('perfil');
  localStorage.removeItem('idUsuario');
  window.location.href = '/login';
};

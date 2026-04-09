import { useToast } from '../Components/Toast';

/**
 * Get authentication headers for API calls
 */
export const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  return headers;
};

/**
 * Authenticated fetch wrapper
 */
export const authFetch = (url: string, options: RequestInit = {}): Promise<Response> => {
  const authHeaders = getAuthHeaders();
  
  return fetch(url, {
    ...options,
    headers: {
      ...authHeaders,
      ...options.headers,
    },
  });
};

export const useApiErrorHandler = () => {
  const { showError, showSuccess } = useToast();

  const handleApiError = async (response: Response, customMessage?: string) => {
    if (!response.ok) {
      let errorMessage = customMessage || 'Ocorreu um erro inesperado';
      let errorData: any = null;
      
      try {
        errorData = await response.json();
        if (errorData.detail) {
          errorMessage = errorData.detail;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }
      } catch (e) {
        // If we can't parse JSON, use default message based on status
        console.error('Failed to parse error response:', e);
      }

      // Handle specific HTTP status codes
      switch (response.status) {
        case 400:
          errorMessage = errorData?.detail || 'Dados inválidos. Verifique as informações enviadas.';
          break;
        case 401:
          errorMessage = 'Acesso negado. Faça login novamente.';
          // Redirect to login on 401
          localStorage.removeItem('token');
          localStorage.removeItem('perfil');
          localStorage.removeItem('idUsuario');
          window.location.href = '/login';
          break;
        case 403:
          errorMessage = 'Você não tem permissão para executar esta ação.';
          break;
        case 404:
          errorMessage = 'Recurso não encontrado.';
          break;
        case 409:
          errorMessage = errorData?.detail || 'Conflito de dados. Este recurso já existe.';
          break;
        case 422:
          errorMessage = errorData?.detail || 'Dados inválidos. Verifique os campos obrigatórios.';
          break;
        case 429:
          errorMessage = 'Muitas tentativas. Aguarde um momento antes de tentar novamente.';
          break;
        case 500:
          errorMessage = 'Erro interno do servidor. Tente novamente mais tarde.';
          break;
        case 502:
          errorMessage = 'Servidor indisponível. Tente novamente em alguns instantes.';
          break;
        case 503:
          errorMessage = 'Serviço temporariamente indisponível. Tente novamente mais tarde.';
          break;
        default:
          // Use the message from the server or the custom message
          errorMessage = errorData?.detail || errorData?.message || customMessage || `Erro ${response.status}: ${response.statusText}`;
          break;
      }

      showError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const handleSuccess = (message: string) => {
    showSuccess(message);
  };

  /**
   * Convenience method for authenticated API calls
   */
  const makeAuthenticatedCall = async (
    url: string, 
    options: RequestInit = {},
    successMessage?: string,
    silent = false
  ): Promise<Response> => {
    const response = await authFetch(url, options);
    
    if (!silent) {
      await handleApiError(response);
      if (successMessage) {
        handleSuccess(successMessage);
      }
    } else if (!response.ok) {
      // Silent mode: still throw error but don't show toast
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return response;
  };

  /**
   * Silent version for data loading operations
   */
  const makeSilentAuthenticatedCall = async (
    url: string, 
    options: RequestInit = {}
  ): Promise<Response> => {
    return makeAuthenticatedCall(url, options, undefined, true);
  };

  return { handleApiError, handleSuccess, makeAuthenticatedCall, makeSilentAuthenticatedCall };
};

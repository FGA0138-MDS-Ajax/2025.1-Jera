// Migration helper utilities for converting pages to use toast notifications

import { useToast } from '../Components/Toast';
import { useApiErrorHandler } from './apiErrorHandler';

/**
 * Hook that combines toast and API error handling for easy migration
 * Use this to quickly convert existing pages to the new toast system
 */
export const useNotifications = () => {
  const toast = useToast();
  const apiHandler = useApiErrorHandler();

  return {
    // Direct toast methods
    showSuccess: toast.showSuccess,
    showError: toast.showError,
    showWarning: toast.showWarning,
    showInfo: toast.showInfo,
    
    // API handling methods
    handleApiError: apiHandler.handleApiError,
    handleSuccess: apiHandler.handleSuccess,
    
    // Convenience method for common patterns
    handleApiCall: async (apiCall: () => Promise<Response>, successMessage?: string) => {
      try {
        const response = await apiCall();
        await apiHandler.handleApiError(response);
        if (successMessage) {
          apiHandler.handleSuccess(successMessage);
        }
        return response;
      } catch (error) {
        console.error('API call failed:', error);
        throw error;
      }
    },
    
    // Method for client-side validation
    validateAndShowError: (condition: boolean, errorMessage: string): boolean => {
      if (!condition) {
        toast.showError(errorMessage);
        return false;
      }
      return true;
    }
  };
};

/**
 * Helper for migrating fetch calls
 * Replace: const response = await fetch(url, options);
 * With: const response = await safeFetch(url, options);
 */
export const safeFetch = async (
  url: string, 
  options?: RequestInit,
  onSuccess?: (response: Response) => void
): Promise<Response> => {
  const { handleApiError } = useApiErrorHandler();
  
  const response = await fetch(url, options);
  await handleApiError(response);
  
  if (onSuccess) {
    onSuccess(response);
  }
  
  return response;
};

/**
 * Common validation patterns
 */
export const validation = {
  required: (value: string, fieldName: string): boolean => {
    if (!value.trim()) {
      const { showError } = useToast();
      showError(`${fieldName} é obrigatório.`);
      return false;
    }
    return true;
  },
  
  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      const { showError } = useToast();
      showError('Por favor, insira um email válido.');
      return false;
    }
    return true;
  },
  
  minLength: (value: string, min: number, fieldName: string): boolean => {
    if (value.length < min) {
      const { showError } = useToast();
      showError(`${fieldName} deve ter pelo menos ${min} caracteres.`);
      return false;
    }
    return true;
  },
  
  passwordMatch: (password: string, confirmPassword: string): boolean => {
    if (password !== confirmPassword) {
      const { showError } = useToast();
      showError('As senhas não coincidem.');
      return false;
    }
    return true;
  }
};

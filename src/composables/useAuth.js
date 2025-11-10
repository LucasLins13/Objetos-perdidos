/**
 * Composable: useAuth
 * Responsabilidade: Gerenciar estado de autenticação e permissões
 */

import { ref, computed, onMounted, onUnmounted } from 'vue';
import { AuthService } from '../services';
import { USER_ROLES, MESSAGES } from '../constants';

// Estado global de autenticação (compartilhado entre componentes)
const currentUser = ref(null);
const loading = ref(true);
const error = ref(null);

let unsubscribeAuth = null;

export function useAuth() {
  /**
   * Inicializa o listener de autenticação
   */
  const initAuth = () => {
    loading.value = true;
    
    unsubscribeAuth = AuthService.onAuthStateChange((user) => {
      currentUser.value = user;
      loading.value = false;
    });
  };

  /**
   * Faz login com email e senha
   * @param {string} email - Email do usuário
   * @param {string} password - Senha do usuário
   */
  const login = async (email, password) => {
    try {
      loading.value = true;
      error.value = null;
      
      const user = await AuthService.login(email, password);
      currentUser.value = user;
      
      return { success: true, message: MESSAGES.LOGIN_SUCCESS };
    } catch (err) {
      error.value = err.message;
      return { success: false, message: err.message };
    } finally {
      loading.value = false;
    }
  };

  /**
   * Cria nova conta
   * @param {string} email - Email do usuário
   * @param {string} password - Senha do usuário
   * @param {string} displayName - Nome de exibição
   */
  const register = async (email, password, displayName = '') => {
    try {
      loading.value = true;
      error.value = null;
      
      const user = await AuthService.register(email, password, displayName);
      currentUser.value = user;
      
      return { success: true, message: 'Conta criada com sucesso!' };
    } catch (err) {
      error.value = err.message;
      return { success: false, message: err.message };
    } finally {
      loading.value = false;
    }
  };

  /**
   * Faz logout do usuário
   */
  const logout = async () => {
    try {
      loading.value = true;
      error.value = null;
      
      await AuthService.logout();
      currentUser.value = null;
      
      return { success: true, message: MESSAGES.LOGOUT_SUCCESS };
    } catch (err) {
      error.value = err.message;
      return { success: false, message: err.message };
    } finally {
      loading.value = false;
    }
  };

  // Computed properties para verificações de permissões
  const isAuthenticated = computed(() => currentUser.value !== null);
  
  const isAdmin = computed(() => {
    return currentUser.value?.role === USER_ROLES.ADMIN;
  });

  const userRole = computed(() => currentUser.value?.role || null);

  const userName = computed(() => {
    return currentUser.value?.displayName || currentUser.value?.email || 'Usuário';
  });

  const userEmail = computed(() => currentUser.value?.email || '');

  /**
   * Verifica se o usuário tem permissão para realizar ação administrativa
   * @returns {boolean} True se tem permissão
   */
  const canPerformAdminAction = () => {
    if (!isAuthenticated.value) {
      error.value = MESSAGES.PERMISSION_DENIED;
      return false;
    }
    
    if (!isAdmin.value) {
      error.value = MESSAGES.ADMIN_ONLY;
      return false;
    }
    
    return true;
  };

  /**
   * Limpa mensagens de erro
   */
  const clearError = () => {
    error.value = null;
  };

  // Inicializar listener ao montar
  onMounted(() => {
    if (!unsubscribeAuth) {
      initAuth();
    }
  });

  // Limpar listener ao desmontar
  onUnmounted(() => {
    // Não cancelar aqui porque o estado é global
    // O listener deve persistir entre componentes
  });

  return {
    // Estado
    currentUser,
    loading,
    error,
    
    // Computed
    isAuthenticated,
    isAdmin,
    userRole,
    userName,
    userEmail,
    
    // Métodos
    login,
    register,
    logout,
    canPerformAdminAction,
    clearError,
    initAuth,
  };
}

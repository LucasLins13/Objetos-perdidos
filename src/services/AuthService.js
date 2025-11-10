/**
 * Service: AuthService
 * Responsabilidade: Gerenciar autenticação e autorização de usuários
 */

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import { ADMIN_EMAILS, USER_ROLES } from '../constants';

export class AuthService {
  /**
   * Faz login com email e senha
   * @param {string} email - Email do usuário
   * @param {string} password - Senha do usuário
   * @returns {Promise<Object>} Dados do usuário autenticado
   */
  static async login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        role: this.getUserRole(user.email),
      };
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Cria nova conta com email e senha
   * @param {string} email - Email do usuário
   * @param {string} password - Senha do usuário
   * @param {string} displayName - Nome de exibição do usuário
   * @returns {Promise<Object>} Dados do usuário criado
   */
  static async register(email, password, displayName = '') {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Atualizar perfil com nome de exibição
      if (displayName) {
        await updateProfile(user, { displayName });
      }

      return {
        uid: user.uid,
        email: user.email,
        displayName: displayName || user.displayName,
        role: this.getUserRole(user.email),
      };
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Faz logout do usuário
   */
  static async logout() {
    try {
      await signOut(auth);
    } catch (error) {
      throw new Error('Erro ao fazer logout');
    }
  }

  /**
   * Observa mudanças no estado de autenticação
   * @param {Function} callback - Função chamada quando o estado muda
   * @returns {Function} Função para cancelar a observação
   */
  static onAuthStateChange(callback) {
    return onAuthStateChanged(auth, (user) => {
      if (user) {
        callback({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          role: this.getUserRole(user.email),
        });
      } else {
        callback(null);
      }
    });
  }

  /**
   * Verifica se o email é de um administrador
   * @param {string} email - Email para verificar
   * @returns {boolean} True se é admin
   */
  static isAdmin(email) {
    if (!email) return false;
    return ADMIN_EMAILS.includes(email.toLowerCase());
  }

  /**
   * Obtém a role (função) do usuário baseado no email
   * @param {string} email - Email do usuário
   * @returns {string} Role do usuário (admin ou user)
   */
  static getUserRole(email) {
    return this.isAdmin(email) ? USER_ROLES.ADMIN : USER_ROLES.USER;
  }

  /**
   * Verifica se o usuário atual tem permissão de admin
   * @returns {boolean} True se o usuário logado é admin
   */
  static isCurrentUserAdmin() {
    const currentUser = auth.currentUser;
    if (!currentUser) return false;
    return this.isAdmin(currentUser.email);
  }

  /**
   * Obtém o usuário atualmente logado
   * @returns {Object|null} Dados do usuário ou null
   */
  static getCurrentUser() {
    const user = auth.currentUser;
    if (!user) return null;

    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      role: this.getUserRole(user.email),
    };
  }

  /**
   * Verifica se há um usuário logado
   * @returns {boolean} True se há usuário logado
   */
  static isAuthenticated() {
    return auth.currentUser !== null;
  }

  /**
   * Trata erros do Firebase Auth e retorna mensagens amigáveis
   * @param {Error} error - Erro do Firebase
   * @returns {Error} Erro com mensagem tratada
   */
  static handleAuthError(error) {
    const errorMessages = {
      'auth/invalid-email': 'Email inválido.',
      'auth/user-disabled': 'Esta conta foi desativada.',
      'auth/user-not-found': 'Usuário não encontrado.',
      'auth/wrong-password': 'Senha incorreta.',
      'auth/email-already-in-use': 'Este email já está em uso.',
      'auth/weak-password': 'Senha muito fraca. Use no mínimo 6 caracteres.',
      'auth/operation-not-allowed': 'Operação não permitida.',
      'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde.',
    };

    const message = errorMessages[error.code] || 'Erro ao autenticar. Tente novamente.';
    return new Error(message);
  }
}

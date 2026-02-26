/**
 * Configurações e constantes da aplicação
 */

export const CONTATO_ADRIANA = '5599999999999';

/**
 * Configuração de Autenticação e Permissões
 */
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
};

// Lista de emails com permissão de administrador
export const ADMIN_EMAILS = [
  'admin@achadoseperdidos.com',
  'adriana@achadoseperdidos.com',
  // Adicione mais emails de admin aqui
];

export const FIRESTORE_COLLECTIONS = {
  ITENS: 'itens',
};

export const SUPABASE_BUCKETS = {
  IMAGES: 'images',
};

export const FILTER_STATUS = {
  TODOS: 'todos',
  ATIVOS: 'ativos',
  RECUPERADOS: 'recuperados',
};

export const MESSAGES = {
  ITEM_ADDED_SUCCESS: 'Item adicionado com sucesso!',
  ITEM_UPDATED_SUCCESS: 'Item atualizado com sucesso!',
  ERROR_ADD_ITEM: 'Erro ao adicionar item.',
  ERROR_UPLOAD_IMAGE: 'Erro ao enviar imagem para o Supabase.',
  ERROR_LOAD_ITEMS: 'Erro ao carregar itens.',
  VALIDATION_ERROR: 'Selecione uma imagem e preencha a descrição.',
  ANALYZING_IMAGE: 'Analisando imagem...',
  
  // Auth messages
  LOGIN_SUCCESS: 'Login realizado com sucesso!',
  LOGOUT_SUCCESS: 'Logout realizado com sucesso!',
  ERROR_LOGIN: 'Erro ao fazer login. Verifique suas credenciais.',
  ERROR_INVALID_EMAIL: 'Email inválido.',
  ERROR_WEAK_PASSWORD: 'Senha muito fraca. Use no mínimo 6 caracteres.',
  ERROR_EMAIL_IN_USE: 'Este email já está em uso.',
  ERROR_USER_NOT_FOUND: 'Usuário não encontrado.',
  ERROR_WRONG_PASSWORD: 'Senha incorreta.',
  PERMISSION_DENIED: 'Você não tem permissão para realizar esta ação.',
  ADMIN_ONLY: 'Apenas administradores podem realizar esta ação.',
};

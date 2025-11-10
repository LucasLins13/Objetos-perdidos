/**
 * Composable: useItems
 * Responsabilidade: Gerenciar estado e operações relacionadas aos itens
 */

import { ref, onMounted, onUnmounted } from 'vue';
import { ItemService, StorageService, VisionService, AuthService } from '../services';
import { MESSAGES } from '../constants';

export function useItems() {
  const items = ref([]);
  const loading = ref(false);
  const error = ref(null);
  let unsubscribe = null;

  /**
   * Inicia a escuta em tempo real dos itens
   */
  const startListening = () => {
    loading.value = true;
    error.value = null;

    try {
      unsubscribe = ItemService.subscribeToItems((updatedItems) => {
        items.value = updatedItems;
        loading.value = false;
      });
    } catch (err) {
      error.value = MESSAGES.ERROR_LOAD_ITEMS;
      loading.value = false;
      console.error('Erro ao carregar itens:', err);
    }
  };

  /**
   * Para a escuta em tempo real
   */
  const stopListening = () => {
    if (unsubscribe) {
      unsubscribe();
      unsubscribe = null;
    }
  };

  /**
   * Adiciona um novo item
   * @param {Object} itemData - Dados do item (descricao, imageUrl)
   */
  const addItem = async (itemData) => {
    try {
      loading.value = true;
      error.value = null;
      await ItemService.addItem(itemData);
      return { success: true, message: MESSAGES.ITEM_ADDED_SUCCESS };
    } catch (err) {
      error.value = MESSAGES.ERROR_ADD_ITEM;
      console.error('Erro ao adicionar item:', err);
      return { success: false, message: err.message };
    } finally {
      loading.value = false;
    }
  };

  /**
   * Adiciona item com upload de imagem
   * @param {string} descricao - Descrição do item
   * @param {File} file - Arquivo de imagem
   */
  const addItemWithImage = async (descricao, file) => {
    // Verificar se é admin
    if (!AuthService.isCurrentUserAdmin()) {
      return { success: false, message: MESSAGES.ADMIN_ONLY };
    }

    try {
      loading.value = true;
      error.value = null;

      // 1. Analisar imagem com Google Vision API (antes do upload)
      console.log('Analisando imagem com Google Vision API...');
      const tags = await VisionService.analyzeImageFile(file);
      console.log('Tags extraídas:', tags);

      // 2. Upload da imagem para Supabase
      const imageUrl = await StorageService.uploadImage(file);

      // 3. Adiciona o item no Firestore com as tags
      await ItemService.addItem({ 
        descricao, 
        imageUrl,
        tags, // Incluir tags extraídas
      });

      return { 
        success: true, 
        message: MESSAGES.ITEM_ADDED_SUCCESS,
        tags, // Retornar tags para feedback opcional
      };
    } catch (err) {
      error.value = err.message;
      console.error('Erro ao adicionar item com imagem:', err);
      return { success: false, message: err.message };
    } finally {
      loading.value = false;
    }
  };

  /**
   * Marca um item como recuperado
   * @param {string} itemId - ID do item
   */
  const markAsRecovered = async (itemId) => {
    // Verificar se é admin
    if (!AuthService.isCurrentUserAdmin()) {
      return { success: false, message: MESSAGES.ADMIN_ONLY };
    }

    try {
      loading.value = true;
      error.value = null;
      await ItemService.markAsRecovered(itemId);
      return { success: true, message: MESSAGES.ITEM_UPDATED_SUCCESS };
    } catch (err) {
      error.value = 'Erro ao atualizar item';
      console.error('Erro ao marcar como recuperado:', err);
      return { success: false, message: err.message };
    } finally {
      loading.value = false;
    }
  };

  /**
   * Remove um item
   * @param {string} itemId - ID do item
   */
  const deleteItem = async (itemId) => {
    // Verificar se é admin
    if (!AuthService.isCurrentUserAdmin()) {
      return { success: false, message: MESSAGES.ADMIN_ONLY };
    }

    try {
      loading.value = true;
      error.value = null;
      await ItemService.deleteItem(itemId);
      return { success: true };
    } catch (err) {
      error.value = 'Erro ao deletar item';
      console.error('Erro ao deletar item:', err);
      return { success: false, message: err.message };
    } finally {
      loading.value = false;
    }
  };

  // Lifecycle hooks
  onMounted(startListening);
  onUnmounted(stopListening);

  return {
    items,
    loading,
    error,
    addItem,
    addItemWithImage,
    markAsRecovered,
    deleteItem,
    startListening,
    stopListening,
  };
}

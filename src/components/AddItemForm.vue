<template>
  <Card class="add-item-card">
    <template #title>
      <div class="card-header">
        <div class="header-content">
          <i class="pi pi-plus-circle header-icon"></i>
          <div>
            <h2 class="card-title">Adicionar Item Perdido</h2>
            <p v-if="!isAdmin" class="card-subtitle admin-required">
              <i class="pi pi-lock"></i>
              Requer permissão de administrador
            </p>
          </div>
        </div>
      </div>
    </template>
    <template #content>
      <form @submit.prevent="handleAddItem" class="add-item-form">
        <!-- Upload de Imagem -->
        <div class="form-group">
          <label class="form-label">
            <i class="pi pi-image"></i>
            Imagem do Item
          </label>
          <FileUpload
            mode="basic"
            name="image"
            accept="image/*"
            :choose-label="selectedFile ? 'Alterar imagem' : 'Selecionar imagem'"
            :disabled="!isAdmin"
            class="custom-file-upload"
            @select="onFileSelect"
          >
            <template #uploadicon>
              <i class="pi pi-cloud-upload"></i>
            </template>
          </FileUpload>
          <small v-if="selectedFile" class="file-selected">
            <i class="pi pi-check-circle"></i>
            {{ selectedFile.name }}
          </small>
        </div>

        <!-- Descrição -->
        <div class="form-group">
          <label for="descricao" class="form-label">
            <i class="pi pi-align-left"></i>
            Descrição
          </label>
          <InputText
            id="descricao"
            v-model="descricao"
            placeholder="Descreva o item encontrado..."
            class="form-input"
            size="large"
            :disabled="!isAdmin"
            @keyup.enter="handleAddItem"
          />
        </div>

        <!-- Botão de Adicionar -->
        <Button
          type="submit"
          :label="isSubmitting ? 'Processando...' : 'Adicionar Item'"
          :icon="isSubmitting ? 'pi pi-spin pi-spinner' : 'pi pi-plus'"
          severity="success"
          :loading="isSubmitting"
          :disabled="isSubmitting || !isAdmin"
          class="submit-btn"
          size="large"
        />
        
        <!-- Mensagem para não-admins -->
        <Message v-if="!isAdmin" severity="warn" :closable="false" class="admin-message">
          <div class="message-content">
            <i class="pi pi-exclamation-triangle"></i>
            <span>
              Apenas administradores podem adicionar novos itens. 
              <router-link to="/login" class="message-link">Faça login</router-link> 
              com uma conta de administrador.
            </span>
          </div>
        </Message>
      </form>
    </template>
  </Card>
</template>

<script setup>
import { ref } from 'vue';
import { useItems, useAuth } from '../composables';
import { MESSAGES } from '../constants';
import FileUpload from 'primevue/fileupload';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Card from 'primevue/card';
import Message from 'primevue/message';

const descricao = ref('');
const selectedFile = ref(null);
const isSubmitting = ref(false);

const emit = defineEmits(['item-added']);

// Verificar permissões
const { isAdmin } = useAuth();

// Usar composable para gerenciar itens
const { addItemWithImage } = useItems();

/**
 * Handler para seleção de arquivo
 */
const onFileSelect = (event) => {
  selectedFile.value = event.files[0];
};

/**
 * Valida os campos do formulário
 */
const validateForm = () => {
  if (!descricao.value.trim()) {
    alert('Por favor, preencha a descrição do item.');
    return false;
  }
  
  if (!selectedFile.value) {
    alert('Por favor, selecione uma imagem.');
    return false;
  }
  
  return true;
};

/**
 * Limpa o formulário
 */
const resetForm = () => {
  descricao.value = '';
  selectedFile.value = null;
};

/**
 * Handler para adicionar item
 */
const handleAddItem = async () => {
  // Verificar se é admin
  if (!isAdmin.value) {
    alert(MESSAGES.ADMIN_ONLY);
    return;
  }

  if (!validateForm()) {
    return;
  }

  isSubmitting.value = true;

  try {
    const result = await addItemWithImage(descricao.value, selectedFile.value);

    if (result.success) {
      const tagsInfo = result.tags && result.tags.length > 0 
        ? `\n\nTags detectadas: ${result.tags.join(', ')}`
        : '';
      alert(result.message + tagsInfo);
      resetForm();
      emit('item-added');
    } else {
      alert(result.message || MESSAGES.ERROR_ADD_ITEM);
    }
  } catch (error) {
    console.error('Erro ao adicionar item:', error);
    alert(MESSAGES.ERROR_UPLOAD_IMAGE);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.add-item-card {
  box-shadow: var(--app-shadow) !important;
  border-radius: var(--app-radius-lg) !important;
  margin-bottom: 2rem;
}

.card-header {
  padding: 0.5rem 0;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-icon {
  font-size: 2rem;
  color: var(--app-success);
}

.card-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--app-text);
  margin: 0;
  line-height: 1.2;
}

.card-subtitle {
  font-size: 0.875rem;
  color: var(--app-text-secondary);
  margin: 0.25rem 0 0 0;
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.admin-required {
  color: var(--app-danger);
}

.admin-required i {
  font-size: 0.75rem;
}

.add-item-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--app-text);
}

.form-label i {
  color: var(--app-primary);
}

.form-input {
  width: 100%;
}

.custom-file-upload {
  width: 100%;
}

.custom-file-upload :deep(.p-button) {
  width: 100%;
  justify-content: center;
  padding: 0.875rem 1.25rem;
  font-size: 1rem;
}

.file-selected {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--app-success);
  font-size: 0.875rem;
  margin-top: -0.25rem;
}

.file-selected i {
  font-size: 1rem;
}

.submit-btn {
  width: 100%;
  justify-content: center;
  font-weight: 600;
  padding: 0.875rem 1.25rem;
  margin-top: 0.5rem;
}

.admin-message {
  margin-top: 0.5rem;
}

.message-content {
  display: flex;
  align-items: flex-start;
  gap: 0.625rem;
}

.message-content i {
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.message-link {
  color: var(--app-primary);
  text-decoration: underline;
  font-weight: 600;
  transition: opacity 0.2s ease;
}

.message-link:hover {
  opacity: 0.8;
}

/* Responsividade */
@media (max-width: 640px) {
  .header-content {
    gap: 0.75rem;
  }
  
  .header-icon {
    font-size: 1.5rem;
  }
  
  .card-title {
    font-size: 1.25rem;
  }
  
  .card-subtitle {
    font-size: 0.8125rem;
  }
}
</style>

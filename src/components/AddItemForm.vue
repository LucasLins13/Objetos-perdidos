<template>
  <Card class="mb-4">
    <template #title>Adicionar item perdido</template>
    <template #content>
      <div class="flex flex-col gap-3">
        <FileUpload
          mode="basic"
          name="image"
          accept="image/*"
          choose-label="Selecionar imagem"
          @select="onFileSelect"
        />
        <InputText
          v-model="descricao"
          placeholder="Descrição do item"
          class="w-full"
          @keyup.enter="handleAddItem"
        />
        <Button
          label="Adicionar"
          icon="pi pi-plus"
          severity="success"
          :loading="isSubmitting"
          @click="handleAddItem"
        />
      </div>
    </template>
  </Card>
</template>

<script setup>
import { ref } from 'vue';
import { useItems } from '../composables';
import { MESSAGES } from '../constants';
import FileUpload from 'primevue/fileupload';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Card from 'primevue/card';

const descricao = ref('');
const selectedFile = ref(null);
const isSubmitting = ref(false);

const emit = defineEmits(['item-added']);

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
  if (!validateForm()) {
    return;
  }

  isSubmitting.value = true;

  try {
    const result = await addItemWithImage(descricao.value, selectedFile.value);

    if (result.success) {
      alert(result.message);
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

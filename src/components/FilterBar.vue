<template>
  <div
    class="flex flex-wrap gap-3 items-center bg-white p-3 rounded-lg shadow-md"
  >
    <InputText
      :model-value="filterText"
      placeholder="Buscar item..."
      class="w-full sm:w-auto"
      @update:model-value="updateText"
      @keyup.enter="handleFilter"
    />

    <Dropdown
      :model-value="filterStatus"
      :options="statusOptions"
      optionLabel="label"
      optionValue="value"
      class="w-full sm:w-48"
      @update:model-value="updateStatus"
    />

    <Button
      icon="pi pi-filter"
      label="Filtrar"
      severity="primary"
      outlined
      @click="handleFilter"
    />
  </div>
</template>

<script setup>
import { watch } from 'vue';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';

const props = defineProps({
  filterText: {
    type: String,
    default: '',
  },
  filterStatus: {
    type: String,
    default: 'todos',
  },
  statusOptions: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(['filtrar']);

/**
 * Atualiza o texto do filtro
 */
const updateText = (value) => {
  emit('filtrar', { texto: value, status: props.filterStatus });
};

/**
 * Atualiza o status do filtro
 */
const updateStatus = (value) => {
  emit('filtrar', { texto: props.filterText, status: value });
};

/**
 * Handler para botão de filtrar
 */
const handleFilter = () => {
  emit('filtrar', { texto: props.filterText, status: props.filterStatus });
};

// Auto-filtrar quando os valores mudam
watch([() => props.filterText, () => props.filterStatus], () => {
  emit('filtrar', { texto: props.filterText, status: props.filterStatus });
});
</script>

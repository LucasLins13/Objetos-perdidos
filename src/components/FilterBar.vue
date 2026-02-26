<template>
  <div class="filter-bar">
    <div class="filter-input-group">
      <i class="pi pi-search filter-icon"></i>
      <InputText
        :model-value="filterText"
        placeholder="Buscar por descrição ou tags..."
        class="filter-input"
        @update:model-value="updateText"
        @keyup.enter="handleFilter"
      />
    </div>

    <Select
      :model-value="filterStatus"
      :options="statusOptions"
      optionLabel="label"
      optionValue="value"
      placeholder="Status"
      class="filter-dropdown"
      @update:model-value="updateStatus"
    >
      <template #value="slotProps">
        <div v-if="slotProps.value" class="flex items-center gap-2 pad2">
          <i :class="getStatusIcon(slotProps.value)"></i>
          <span>{{ slotProps.placeholder || getStatusLabel(slotProps.value) }}</span>
        </div>
      </template>
      <template #option="slotProps">
        <div class="flex items-center gap-2 pad">
          <i :class="getStatusIcon(slotProps.option.value)"></i>
          <span>{{ slotProps.option.label }}</span>
        </div>
      </template>
    </Select>
  </div>
</template>

<script setup>
import { watch } from 'vue';
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';
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

/**
 * Retorna o ícone apropriado para cada status
 */
const getStatusIcon = (status) => {
  const icons = {
    todos: 'pi pi-list',
    ativos: 'pi pi-clock',
    recuperados: 'pi pi-check-circle'
  };
  return icons[status] || 'pi pi-list';
};

/**
 * Retorna o label do status
 */
const getStatusLabel = (status) => {
  const option = props.statusOptions.find(opt => opt.value === status);
  return option ? option.label : '';
};

// Auto-filtrar quando os valores mudam
watch([() => props.filterText, () => props.filterStatus], () => {
  emit('filtrar', { texto: props.filterText, status: props.filterStatus });
});
</script>

<style scoped>

.pad {
  padding: 10px;
}

.filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  padding: 1.25rem;
  background-color: var(--app-surface);
  border: 1px solid var(--app-border);
  border-radius: var(--app-radius-lg);
  box-shadow: var(--app-shadow);
}

.filter-input-group {
  position: relative;
  flex: 1;
  min-width: 200px;
}

.filter-icon {
  position: absolute;
  left: 0.875rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--app-text-muted);
  pointer-events: none;
}

.filter-input {
  width: 100%;
  padding-left: 2.75rem !important;
}

.filter-dropdown {
  min-width: 200px;
}

:deep(.p-select-label) {
  display: flex;
  align-items: center;
  padding-left: 10px;
}

@media (max-width: 640px) {
  .filter-bar {
    padding: 1rem;
  }
  
  .filter-input-group,
  .filter-dropdown {
    width: 100%;
  }

  .pad2 {
    padding: 10px;
  }
}
</style>

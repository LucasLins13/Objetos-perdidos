<template>
  <div class="max-w-5xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-4">Achados & Perdidos</h1>

    <FilterBar 
      :filter-text="filterText"
      :filter-status="filterStatus"
      :status-options="statusOptions"
      @filtrar="applyFilter" 
    />

    <div v-if="loading" class="text-gray-500 mt-8 text-center">
      Carregando itens...
    </div>

    <div v-else-if="filteredItems.length === 0" class="text-gray-500 mt-8 text-center">
      Nenhum item encontrado.
    </div>

    <div v-else class="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <ItemCard
        v-for="item in filteredItems"
        :key="item.id"
        :item="item"
        :contato="contatoAdriana"
        @mark-recovered="handleMarkRecovered"
      />
    </div>
  </div>
</template>

<script setup>
import { useItems, useItemFilter } from '../composables';
import { CONTATO_ADRIANA } from '../constants';
import ItemCard from '../components/ItemCard.vue';
import FilterBar from '../components/FilterBar.vue';

const contatoAdriana = CONTATO_ADRIANA;

// Usar composables para gerenciar estado
const { items, loading, markAsRecovered } = useItems();
const { filterText, filterStatus, statusOptions, filteredItems, applyFilter } = useItemFilter(items);

// Handler para marcar item como recuperado
const handleMarkRecovered = async (itemId) => {
  await markAsRecovered(itemId);
};
</script>

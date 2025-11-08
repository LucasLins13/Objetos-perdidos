<template>
  <div class="max-w-3xl mx-auto p-6">
    <h2 class="text-xl font-semibold mb-4">Área da Adriana (Adicionar item)</h2>
    
    <AddItemForm @item-added="handleItemAdded" />
    
    <p class="text-sm text-gray-600 mt-6 mb-2">Itens recentes</p>
    
    <div v-if="loading" class="text-gray-500 text-center">
      Carregando itens...
    </div>
    
    <div v-else class="mt-4 grid grid-cols-1 gap-3">
      <ItemCard 
        v-for="item in items" 
        :key="item.id" 
        :item="item" 
        :contato="contatoAdriana"
        @mark-recovered="handleMarkRecovered"
      />
    </div>
  </div>
</template>

<script setup>
import { useItems } from '../composables';
import { CONTATO_ADRIANA } from '../constants';
import AddItemForm from '../components/AddItemForm.vue';
import ItemCard from '../components/ItemCard.vue';

const contatoAdriana = CONTATO_ADRIANA;

// Usar composable para gerenciar itens
const { items, loading, markAsRecovered } = useItems();

// Handler para quando um item é adicionado
const handleItemAdded = () => {
  // Os itens serão atualizados automaticamente pelo listener em tempo real
  console.log('Item adicionado com sucesso');
};

// Handler para marcar item como recuperado
const handleMarkRecovered = async (itemId) => {
  await markAsRecovered(itemId);
};
</script>

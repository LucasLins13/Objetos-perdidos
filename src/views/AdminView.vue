<template>
  <div class="admin-view">
    <div class="admin-container">
      <!-- Header -->
      <header class="admin-header">
        <div class="header-content">
          <i class="pi pi-shield header-icon"></i>
          <div>
            <h1 class="admin-title">Área Administrativa</h1>
            <p class="admin-subtitle">Gerenciar itens perdidos e encontrados</p>
          </div>
        </div>
      </header>
      
      <!-- Add Item Form -->
      <AddItemForm @item-added="handleItemAdded" />
      
      <!-- Recent Items Section -->
      <section class="recent-items-section">
        <div class="section-header">
          <h2 class="section-title">
            <i class="pi pi-clock"></i>
            Itens Recentes
          </h2>
          <span class="items-count">{{ items.length }} {{ items.length === 1 ? 'item' : 'itens' }}</span>
        </div>
        
        <!-- Loading State -->
        <div v-if="loading" class="state-message">
          <i class="pi pi-spin pi-spinner text-3xl mb-2"></i>
          <p>Carregando itens...</p>
        </div>
        
        <!-- Empty State -->
        <div v-else-if="items.length === 0" class="state-message">
          <i class="pi pi-inbox text-4xl mb-2 opacity-50"></i>
          <p class="text-lg font-medium">Nenhum item cadastrado</p>
          <p class="text-sm text-muted mt-1">
            Adicione o primeiro item usando o formulário acima
          </p>
        </div>
        
        <!-- Items Grid -->
        <div v-else class="items-grid">
          <ItemCard 
            v-for="item in items" 
            :key="item.id" 
            :item="item" 
            :contato="contatoAdriana"
            @mark-recovered="handleMarkRecovered"
          />
        </div>
      </section>
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

<style scoped>
.admin-view {
  min-height: calc(100vh - 6rem);
  padding-bottom: 3rem;
}

.admin-container {
  max-width: 1024px;
  margin: 0 auto;
  padding: 0 1rem;
}

.admin-header {
  margin-bottom: 2rem;
  padding: 1.5rem 0;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.header-icon {
  font-size: 2.5rem;
  color: var(--app-primary);
  background: linear-gradient(135deg, var(--app-primary) 0%, var(--app-primary-hover) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.admin-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--app-text);
  margin: 0;
  line-height: 1.2;
}

.admin-subtitle {
  font-size: 1rem;
  color: var(--app-text-secondary);
  margin: 0.25rem 0 0 0;
}

.recent-items-section {
  margin-top: 3rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--app-border);
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  font-size: 1.375rem;
  font-weight: 600;
  color: var(--app-text);
  margin: 0;
}

.section-title i {
  color: var(--app-primary);
}

.items-count {
  display: inline-flex;
  align-items: center;
  padding: 0.375rem 0.875rem;
  background-color: var(--app-surface-hover);
  border: 1px solid var(--app-border);
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--app-text-secondary);
}

.state-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 1rem;
  color: var(--app-text-secondary);
  text-align: center;
}

.text-muted {
  color: var(--app-text-muted);
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 320px), 1fr));
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .items-grid {
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 350px), 1fr));
  }
}

/* Responsividade */
@media (max-width: 640px) {
  .admin-header {
    margin-bottom: 1.5rem;
    padding: 1rem 0;
  }
  
  .header-content {
    gap: 0.875rem;
  }
  
  .header-icon {
    font-size: 2rem;
  }
  
  .admin-title {
    font-size: 1.5rem;
  }
  
  .admin-subtitle {
    font-size: 0.875rem;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
  
  .section-title {
    font-size: 1.125rem;
  }
}
</style>

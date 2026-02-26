<template>
  <div class="home-view">
    <div class="home-container">
      <!-- Header -->
      <header class="home-header">
        <h1 class="home-title">
          <i class="pi pi-compass mr-3"></i>
          Achados & Perdidos
        </h1>
        <p class="home-subtitle">
          Encontre objetos perdidos ou ajude alguém a recuperar o que é seu
        </p>
      </header>

      <!-- Filtros -->
      <div class="filter-section">
        <FilterBar 
          :filter-text="filterText"
          :filter-status="filterStatus"
          :status-options="statusOptions"
          @filtrar="applyFilter" 
        />
      </div>

      <!-- Loading -->
      <div v-if="loading" class="state-message">
        <i class="pi pi-spin pi-spinner text-4xl mb-3"></i>
        <p>Carregando itens...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredItems.length === 0" class="state-message">
        <i class="pi pi-inbox text-5xl mb-3 opacity-50"></i>
        <p class="text-lg font-medium">Nenhum item encontrado</p>
        <p class="text-sm text-muted mt-1">
          Tente ajustar os filtros ou aguarde novos itens
        </p>
      </div>

      <!-- Items Grid -->
      <Transition name="fade" mode="out-in">
        <div v-if="!loading && filteredItems.length > 0" class="items-grid">
          <TransitionGroup name="list">
            <ItemCard
              v-for="item in filteredItems"
              :key="item.id"
              :item="item"
              :contato="contatoAdriana"
              @mark-recovered="handleMarkRecovered"
              @delete="handleItemDelete"
            />
          </TransitionGroup>
        </div>
      </Transition>

      <!-- Stats (se houver itens) -->
      <div v-if="!loading && items.length > 0" class="stats-section">
        <div class="stat-card">
          <i class="pi pi-box stat-icon"></i>
          <div>
            <div class="stat-value">{{ items.length }}</div>
            <div class="stat-label">Total de Itens</div>
          </div>
        </div>
        <div class="stat-card">
          <i class="pi pi-check-circle stat-icon text-green-500"></i>
          <div>
            <div class="stat-value">{{ recoveredCount }}</div>
            <div class="stat-label">Recuperados</div>
          </div>
        </div>
        <div class="stat-card">
          <i class="pi pi-clock stat-icon text-orange-500"></i>
          <div>
            <div class="stat-value">{{ pendingCount }}</div>
            <div class="stat-label">Aguardando</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useItems, useItemFilter } from '../composables';
import { CONTATO_ADRIANA } from '../constants';
import ItemCard from '../components/ItemCard.vue';
import FilterBar from '../components/FilterBar.vue';

const contatoAdriana = CONTATO_ADRIANA;

// Usar composables para gerenciar estado
const { items, loading, markAsRecovered, deleteItem } = useItems();
const { filterText, filterStatus, statusOptions, filteredItems, applyFilter } = useItemFilter(items);

// Estatísticas
const recoveredCount = computed(() => 
  items.value.filter(item => item.recuperado).length
);

const pendingCount = computed(() => 
  items.value.filter(item => !item.recuperado).length
);

// Handler para marcar item como recuperado
const handleMarkRecovered = async (itemId) => {
  await markAsRecovered(itemId);
};

const handleItemDelete = async (itemId) => {
  await deleteItem(itemId);
}
</script>

<style scoped>
.home-view {
  min-height: calc(100vh - 6rem);
  padding-bottom: 3rem;
}

.home-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
}

.home-header {
  text-align: center;
  margin-bottom: 2.5rem;
  padding: 2rem 0;
}

.home-title {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 700;
  color: var(--app-text);
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.home-subtitle {
  font-size: clamp(0.875rem, 2vw, 1.125rem);
  color: var(--app-text-secondary);
  max-width: 600px;
  margin: 0 auto;
}

.filter-section {
  margin-bottom: 2rem;
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
  margin-bottom: 3rem;
}

@media (min-width: 768px) {
  .items-grid {
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 350px), 1fr));
  }
}

.stats-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid var(--app-border);
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background-color: var(--app-surface);
  border: 1px solid var(--app-border);
  border-radius: var(--app-radius);
  box-shadow: var(--app-shadow-sm);
  transition: all 0.2s ease;
}

.stat-card:hover {
  box-shadow: var(--app-shadow);
  transform: translateY(-2px);
}

.stat-icon {
  font-size: 2rem;
  color: var(--app-primary);
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--app-text);
  line-height: 1;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--app-text-secondary);
  margin-top: 0.25rem;
}

/* Transições */
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.list-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.list-leave-active {
  position: absolute;
}
</style>

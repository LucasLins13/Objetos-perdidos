<template>
  <article class="item-card">
    <!-- Image -->
    <div class="item-image-container">
      <img
        :src="item.imageUrl"
        :alt="item.descricao"
        class="item-image"
        loading="lazy"
      />
      <div class="item-status-badge" :class="statusBadgeClass">
        <i :class="statusIcon"></i>
        {{ statusText }}
      </div>
    </div>

    <!-- Content -->
    <div class="item-content">
      <!-- Title -->
      <h3 class="item-title">{{ item.descricao }}</h3>

      <!-- Tags -->
      <div v-if="item.tags && item.tags.length > 0" class="item-tags">
        <span 
          v-for="tag in item.tags" 
          :key="tag"
          class="item-tag"
        >
          <i class="pi pi-tag"></i>
          {{ tag }}
        </span>
      </div>

      <!-- Actions -->
      <div class="item-actions">
        <Button
          v-if="isAdmin && !item.recuperado"
          :label="recoveredButtonLabel"
          icon="pi pi-check"
          severity="success"
          size="small"
          outlined
          class="action-btn"
          @click="handleMarkRecovered"
        />

        <Button
          label="Contato"
          icon="pi pi-whatsapp"
          severity="success"
          size="small"
          class="action-btn whatsapp-btn"
          @click="handleOpenWhatsApp"
        />
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue';
import { WhatsAppService } from '../services';
import { useAuth } from '../composables';
import Button from 'primevue/button';
import Card from 'primevue/card';

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  contato: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['mark-recovered']);

// Verificar se usuário é admin
const { isAdmin } = useAuth();

// Computed properties para UI
const statusBadgeClass = computed(() => 
  props.item.recuperado ? 'status-recovered' : 'status-pending'
);

const statusIcon = computed(() =>
  props.item.recuperado ? 'pi pi-check-circle' : 'pi pi-clock'
);

const statusText = computed(() => 
  props.item.recuperado ? 'Recuperado' : 'Aguardando'
);

const recoveredButtonLabel = computed(() => 
  props.item.recuperado ? 'Recuperado' : 'Recuperado'
);

// Handlers que emitem eventos para o pai
const handleMarkRecovered = () => {
  emit('mark-recovered', props.item.id);
};

const handleOpenWhatsApp = () => {
  const message = WhatsAppService.createItemMessage('Adriana', props.item.descricao);
  WhatsAppService.openChat(props.contato, message);
};
</script>

<style scoped>
.item-card {
  background-color: var(--app-surface);
  border: 1px solid var(--app-border);
  border-radius: var(--app-radius-lg);
  box-shadow: var(--app-shadow);
  overflow: hidden;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.item-card:hover {
  box-shadow: var(--app-shadow-lg);
  transform: translateY(-4px);
}

.item-image-container {
  position: relative;
  width: 100%;
  height: 220px;
  overflow: hidden;
  background-color: var(--app-border);
}

.item-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.item-card:hover .item-image {
  transform: scale(1.05);
}

.item-status-badge {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  padding: 0.375rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  gap: 0.375rem;
  box-shadow: var(--app-shadow);
}

.status-pending {
  background-color: rgba(239, 68, 68, 0.9);
  color: white;
}

.status-recovered {
  background-color: rgba(16, 185, 129, 0.9);
  color: white;
}

.item-content {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 1;
}

.item-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--app-text);
  margin: 0;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.item-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.item-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.625rem;
  background-color: rgba(59, 130, 246, 0.1);
  color: var(--app-primary);
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.app-dark .item-tag {
  background-color: rgba(96, 165, 250, 0.15);
}

.item-tag:hover {
  background-color: rgba(59, 130, 246, 0.2);
}

.item-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: auto;
}

.action-btn {
  flex: 1;
  justify-content: center;
}

.whatsapp-btn:hover {
  background-color: #25D366 !important;
  border-color: #25D366 !important;
  color: white !important;
}

@media (max-width: 640px) {
  .item-image-container {
    height: 180px;
  }
  
  .item-content {
    padding: 1rem;
  }
  
  .item-title {
    font-size: 1rem;
  }
  
  .item-actions {
    flex-direction: column;
  }
}
</style>

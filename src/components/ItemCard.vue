<template>
  <Card class="shadow-md">
    <template #header>
      <img
        :src="item.imageUrl"
        alt="Item"
        class="w-full h-48 object-cover rounded-t-lg"
      />
    </template>

    <template #title>
      {{ item.descricao }}
    </template>

    <template #subtitle>
      <span :class="statusClass">
        {{ statusText }}
      </span>
    </template>

    <template #content>
      <div class="flex justify-between mt-3">
        <Button
          :label="recoveredButtonLabel"
          :disabled="item.recuperado"
          icon="pi pi-check"
          severity="success"
          @click="handleMarkRecovered"
        />

        <Button
          label="Falar c/ Adriana"
          icon="pi pi-whatsapp"
          severity="info"
          @click="handleOpenWhatsApp"
        />
      </div>
    </template>
  </Card>
</template>

<script setup>
import { computed } from 'vue';
import { WhatsAppService } from '../services';
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

// Computed properties para UI
const statusClass = computed(() => 
  props.item.recuperado ? 'text-green-600' : 'text-red-500'
);

const statusText = computed(() => 
  props.item.recuperado ? '✅ Recuperado' : '❌ Não recuperado'
);

const recoveredButtonLabel = computed(() => 
  props.item.recuperado ? 'Recuperado' : 'Marcar recuperado'
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

<template>
  <div
    class="flex flex-wrap gap-3 items-center bg-white p-3 rounded-lg shadow-md"
  >
    <InputText
      v-model="texto"
      placeholder="Buscar item..."
      class="w-full sm:w-auto"
      @keyup.enter="emitir"
    />

    <Dropdown
      v-model="status"
      :options="opcoes"
      optionLabel="label"
      optionValue="value"
      class="w-full sm:w-48"
    />

    <Button
      icon="pi pi-filter"
      label="Filtrar"
      @click="emitir"
      severity="primary"
      outlined
    />
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import InputText from "primevue/inputtext";
import Dropdown from "primevue/dropdown";
import Button from "primevue/button";

// 🔹 estados reativos
const texto = ref("");
const status = ref("todos");

// 🔹 opções de status
const opcoes = [
  { label: "Todos", value: "todos" },
  { label: "Não recuperados", value: "ativos" },
  { label: "Recuperados", value: "recuperados" },
];

const emit = defineEmits(["filtrar"]);

// 🔹 dispara o evento manualmente
const emitir = () => {
  emit("filtrar", { texto: texto.value, status: status.value });
};

// 🔹 dispara automaticamente quando o filtro muda (mais intuitivo)
watch([texto, status], () => {
  emit("filtrar", { texto: texto.value, status: status.value });
});
</script>

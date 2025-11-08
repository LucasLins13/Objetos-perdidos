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
      <span :class="item.recuperado ? 'text-green-600' : 'text-red-500'">
        {{ item.recuperado ? "✅ Recuperado" : "❌ Não recuperado" }}
      </span>
    </template>

    <template #content>
      <div class="flex justify-between mt-3">
        <Button
          :label="item.recuperado ? 'Recuperado' : 'Marcar recuperado'"
          :disabled="item.recuperado"
          icon="pi pi-check"
          severity="success"
          @click="marcarRecuperado"
        />

        <Button
          label="Falar c/ Adriana"
          icon="pi pi-whatsapp"
          severity="info"
          @click="abrirWhatsapp"
        />
      </div>
    </template>
  </Card>
</template>

<script setup>
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import Button from "primevue/button";
import Card from "primevue/card";

const props = defineProps({
  item: Object,
  contato: String,
});

const emit = defineEmits(["updated"]);

const marcarRecuperado = async () => {
  await updateDoc(doc(db, "itens", props.item.id), { recuperado: true });
  emit("updated");
};

const abrirWhatsapp = () => {
  const url = `https://wa.me/${props.contato}?text=Olá Adriana! Sobre o item: ${props.item.descricao}`;
  window.open(url, "_blank");
};
</script>

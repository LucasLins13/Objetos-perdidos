<template>
  <div class="p-4">
    <AddItemForm />

    <div v-if="itens.length === 0" class="text-gray-500 mt-4 text-center">
      Nenhum item cadastrado ainda.
    </div>

    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4"
    >
      <ItemCard
        v-for="item in itens"
        :key="item.id"
        :item="item"
        contato="5511999999999"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { db } from "../firebase/firebaseConfig";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import AddItemForm from "./AddItemForm.vue";
import ItemCard from "./ItemCard.vue";

const itens = ref([]);

let unsubscribe = null;

onMounted(() => {
  const q = query(collection(db, "itens"), orderBy("createdAt", "desc"));

  // 🔹 Escuta em tempo real (sem precisar recarregar)
  unsubscribe = onSnapshot(q, (snapshot) => {
    itens.value = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  });
});

onUnmounted(() => {
  if (unsubscribe) unsubscribe();
});
</script>

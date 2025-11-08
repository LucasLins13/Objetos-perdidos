<template>
  <div class="max-w-5xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-4">Achados & Perdidos</h1>

    <FilterBar @filtrar="aplicarFiltro" />

    <div v-if="itensFiltrados.length === 0" class="text-gray-500 mt-8 text-center">
      Nenhum item encontrado.
    </div>

    <div v-else class="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <ItemCard
        v-for="item in itensFiltrados"
        :key="item.id"
        :item="item"
        :contato="contatoAdriana"
        @atualiza="fetchItens"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import ItemCard from "../components/ItemCard.vue";
import FilterBar from "../components/FilterBar.vue";

const contatoAdriana = "5599999999999";

const itens = ref([]);
const itensFiltrados = ref([]);

const fetchItens = () => {
  const q = query(collection(db, "itens"), orderBy("createdAt", "desc"));
  onSnapshot(q, (snap) => {
    itens.value = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    itensFiltrados.value = itens.value;
  });
};

onMounted(fetchItens);

const aplicarFiltro = ({ texto, status }) => {
  itensFiltrados.value = itens.value.filter((i) => {
    const textoOk = (i.descricao || "")
      .toLowerCase()
      .includes((texto || "").toLowerCase());
    const statusOk =
      status === "todos" ||
      (status === "ativos" && !i.recuperado) ||
      (status === "recuperados" && i.recuperado);
    return textoOk && statusOk;
  });
};
</script>

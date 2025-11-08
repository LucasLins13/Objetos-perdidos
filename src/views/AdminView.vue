<template>
  <div class="max-w-3xl mx-auto p-6">
    <h2 class="text-xl font-semibold mb-4">Área da Adriana (Adicionar item)</h2>
    <AddItemForm @added="onAdded" />
    <p class="text-sm text-gray-600 mt-4">Itens recentes</p>
    <div class="mt-4 grid grid-cols-1 gap-3">
      <ItemCard v-for="item in itens" :key="item.id" :item="item" :contato="contatoAdriana" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'
import { db } from '../firebase/firebaseConfig'
import AddItemForm from '../components/AddItemForm.vue'
import ItemCard from '../components/ItemCard.vue'

const contatoAdriana = '5599999999999'
const itens = ref([])

const fetchItens = () => {
  const q = query(collection(db, 'itens'), orderBy('createdAt', 'desc'))
  onSnapshot(q, (snap) => {
    itens.value = snap.docs.map(d => ({ id: d.id, ...d.data() }))
  })
}

onMounted(() => fetchItens())

const onAdded = () => {
  // pequena notificação ou ação após adicionar (pode ser expandida)
  fetchItens()
}
</script>

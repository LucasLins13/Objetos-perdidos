<template>
  <div class="max-w-3xl mx-auto p-6">
    <div v-if="item">
      <img
        :src="item.imageUrl"
        class="w-full h-96 object-cover rounded-lg mb-4 shadow-md"
        alt="Imagem do item"
      />

      <h2 class="text-xl font-semibold text-gray-800">
        {{ item.descricao }}
      </h2>

      <p class="text-sm text-gray-600 mt-2">
        Status:
        <strong :class="item.recuperado ? 'text-green-600' : 'text-red-500'">
          {{ item.recuperado ? 'Recuperado' : 'Não recuperado' }}
        </strong>
      </p>

      <div class="mt-5 flex flex-wrap gap-3">
        <button
          @click="marcarRecuperado"
          class="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition"
          :disabled="item.recuperado"
        >
          {{ item.recuperado ? '✅ Já recuperado' : 'Marcar recuperado' }}
        </button>

        <a
          :href="`https://wa.me/${contato}?text=Olá Adriana! Sobre o item: ${item.descricao}`"
          target="_blank"
          class="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition"
        >
          Falar c/ Adriana
        </a>
      </div>
    </div>

    <div v-else class="text-center text-gray-600 mt-10">
      <p>Carregando informações do item...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase/firebaseConfig'
import { useRoute } from 'vue-router'

const route = useRoute()
const item = ref(null)
const contato = '5599999999999' // DDI + número real

// 🔹 Busca o item no Firestore
const load = async () => {
  const d = await getDoc(doc(db, 'itens', route.params.id))
  if (d.exists()) {
    item.value = { id: d.id, ...d.data() }

    // Garante que a imagem tem URL válida
    if (!item.value.imageUrl?.startsWith('http')) {
      // Exemplo de fallback (caso a URL tenha sido salva errada)
      item.value.imageUrl = '/no-image.png'
    }
  }
}

// 🔹 Marca o item como recuperado
const marcarRecuperado = async () => {
  if (!item.value) return
  await updateDoc(doc(db, 'itens', item.value.id), { recuperado: true })
  item.value.recuperado = true
}

onMounted(load)
</script>

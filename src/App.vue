<template>
  <div>
    <!-- Navbar (não mostrar na página de login) -->
    <NavBar v-if="!isLoginPage" />
    
    <!-- Conteúdo principal -->
    <router-view />
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAuth, useTheme } from './composables';
import NavBar from './components/NavBar.vue';

const route = useRoute();
const { initAuth } = useAuth();
const { initTheme } = useTheme();

// Verificar se está na página de login
const isLoginPage = computed(() => route.name === 'login');

// Inicializar autenticação e tema ao montar app
onMounted(() => {
  initAuth();
  initTheme();
});
</script>

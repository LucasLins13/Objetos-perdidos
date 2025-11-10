<template>
  <nav class="navbar">
    <div class="navbar-container">
      <!-- Logo / Title -->
      <div class="navbar-brand">
        <router-link to="/" class="brand-link">
          <i class="pi pi-search text-2xl mr-2"></i>
          <span class="brand-text">Achados & Perdidos</span>
        </router-link>
      </div>

      <!-- Navigation Links & Actions -->
      <div class="navbar-actions">
        <!-- Links de navegação (desktop) -->
        <div class="nav-links hidden md:flex">
          <router-link to="/" class="nav-link">
            <i class="pi pi-home mr-1"></i>
            Home
          </router-link>

          <router-link v-if="isAdmin" to="/admin" class="nav-link">
            <i class="pi pi-cog mr-1"></i>
            Admin
          </router-link>
        </div>

        <!-- Theme Toggle -->
        <Button
          :icon="isDark ? 'pi pi-sun' : 'pi pi-moon'"
          :aria-label="isDark ? 'Ativar modo claro' : 'Ativar modo escuro'"
          text
          rounded
          class="theme-toggle"
          @click="toggleTheme"
        />

        <!-- User Section -->
        <div v-if="isAuthenticated" class="user-section">
          <!-- User info (desktop) -->
          <div class="user-info hidden sm:block">
            <div class="user-name">{{ userName }}</div>
            <div class="user-role">
              {{ isAdmin ? '👑 Admin' : 'Usuário' }}
            </div>
          </div>
          
          <Button
            icon="pi pi-sign-out"
            label="Sair"
            severity="danger"
            text
            size="small"
            class="logout-btn"
            @click="handleLogout"
          />
        </div>

        <!-- Login Button (se não autenticado) -->
        <router-link v-else to="/login">
          <Button
            icon="pi pi-sign-in"
            label="Entrar"
            size="small"
          />
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuth, useTheme } from '../composables';
import Button from 'primevue/button';

const router = useRouter();
const { isAuthenticated, isAdmin, userName, logout } = useAuth();
const { isDark, toggleTheme } = useTheme();

/**
 * Faz logout e redireciona para home
 */
const handleLogout = async () => {
  const result = await logout();
  
  if (result.success) {
    router.push('/');
  }
};
</script>

<style scoped>
.navbar {
  background-color: var(--app-surface);
  border-bottom: 1px solid var(--app-border);
  box-shadow: var(--app-shadow-sm);
  margin-bottom: 1.5rem;
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(8px);
  transition: all 0.3s ease;
}

.navbar-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 4rem;
}

.navbar-brand {
  display: flex;
  align-items: center;
}

.brand-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: var(--app-text);
  font-weight: 700;
  font-size: 1.25rem;
  transition: color 0.2s ease;
}

.brand-link:hover {
  color: var(--app-primary);
}

.brand-text {
  display: none;
}

@media (min-width: 640px) {
  .brand-text {
    display: inline;
  }
}

.navbar-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.nav-links {
  display: flex;
  gap: 0.5rem;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border-radius: var(--app-radius-sm);
  text-decoration: none;
  color: var(--app-text-secondary);
  font-weight: 500;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.nav-link:hover {
  color: var(--app-primary);
  background-color: var(--app-surface-hover);
}

.nav-link.router-link-active {
  color: var(--app-primary);
  background-color: var(--app-surface-hover);
}

.theme-toggle {
  color: var(--app-text-secondary);
}

.user-section {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-info {
  text-align: right;
  line-height: 1.3;
}

.user-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--app-text);
}

.user-role {
  font-size: 0.75rem;
  color: var(--app-text-muted);
}

.logout-btn {
  min-width: auto;
}

@media (max-width: 640px) {
  .navbar-container {
    height: 3.5rem;
  }
  
  .brand-link {
    font-size: 1rem;
  }
  
  .nav-link {
    padding: 0.375rem 0.75rem;
    font-size: 0.8125rem;
  }
}
</style>

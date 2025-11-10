// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import { AuthService } from "../services";
import HomeView from "../views/HomeView.vue";
import AdminView from "../views/AdminView.vue";
import ItemDetailView from "../views/ItemDetailView.vue";
import LoginView from "../views/LoginView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { 
      path: "/", 
      name: "home", 
      component: HomeView 
    },
    { 
      path: "/login", 
      name: "login", 
      component: LoginView,
      meta: { requiresGuest: true } // Apenas para não autenticados
    },
    { 
      path: "/admin", 
      name: "admin", 
      component: AdminView,
      meta: { requiresAdmin: true } // Requer autenticação de admin
    },
    { 
      path: "/item/:id", 
      name: "item", 
      component: ItemDetailView, 
      props: true 
    },
  ],
});

/**
 * Guard global de navegação
 * Protege rotas que requerem autenticação ou permissão admin
 */
router.beforeEach((to, from, next) => {
  const isAuthenticated = AuthService.isAuthenticated();
  const isAdmin = AuthService.isCurrentUserAdmin();

  // Rota requer admin
  if (to.meta.requiresAdmin) {
    if (!isAuthenticated) {
      // Não autenticado, redirecionar para login
      next({ name: 'login', query: { redirect: to.fullPath } });
    } else if (!isAdmin) {
      // Autenticado mas não é admin
      alert('Acesso negado. Apenas administradores podem acessar esta área.');
      next({ name: 'home' });
    } else {
      // É admin, pode prosseguir
      next();
    }
    return;
  }

  // Rota requer que NÃO esteja autenticado (ex: login)
  if (to.meta.requiresGuest && isAuthenticated) {
    next({ name: 'home' });
    return;
  }

  // Rota pública
  next();
});

export default router;

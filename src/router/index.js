// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import AdminView from "../views/AdminView.vue";
import ItemDetailView from "../views/ItemDetailView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", name: "home", component: HomeView },
    { path: "/admin", name: "admin", component: AdminView },
    { path: "/item/:id", name: "item", component: ItemDetailView, props: true },
  ],
});

export default router;

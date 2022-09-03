import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import ComparisonView from "@/views/ComparisonView.vue";
import ResultsView from "@/views/ResultsView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/comparison",
      name: "comparison",
      component: ComparisonView,
    },
    {
      path: "/results",
      name: "results",
      component: ResultsView,
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/AboutView.vue"),
    },
  ],
});

export default router;

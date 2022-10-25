import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "results",
      component: () => import("../views/ResultsView.vue"),
    },
    {
      path: "/details",
      name: "details",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/DetailsView.vue"),
    },
    {
      path: "/notfound",
      name: "notfound",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/NotFoundView.vue"),
    },
  ],
});

export default router;

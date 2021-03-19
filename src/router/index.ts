import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../views/Home.vue";
import authService from "@/services/AuthService";
import { factory } from "@/utils/ConfigLog4j";
const logger = factory.getLogger("Router");

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
  {
    path: "/game",
    name: "Game",
    component: () =>
      import(/* webpackChunkName: "game" */ "../views/GameView.vue"),
  },
  {
    path: "/login",
    name: "Login",
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/LoginView.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  logger.info(`Navigate from ${from.name} to ${to.name}`);
  if (to.name == "Login") {
    next();
    return;
  }
  if (authService.isAuthenticated()) {
    next();
    return;
  }
  logger.info(
    `User is not logged in, abort navigation to ${to.name}, go to login`
  );
  next({ name: "Login" });
});

export default router;

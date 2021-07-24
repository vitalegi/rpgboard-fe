import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import AuthService from "@/login/services/AuthService";
import store from "@/store";
import Container from "typedi";
import { factory } from "@/utils/ConfigLog4j";
const logger = factory.getLogger("Router");

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "SelectGame",
    component: () =>
      import(/* webpackChunkName: "login" */ "../game/view/SelectGameView.vue"),
    meta: { authRequired: true },
  },
  {
    path: "/login",
    name: "Login",
    component: () =>
      import(/* webpackChunkName: "login" */ "../login/views/LoginView.vue"),
    meta: { authRequired: false },
  },
  {
    path: "/logout",
    name: "Logout",
    component: () =>
      import(/* webpackChunkName: "logout" */ "../login/views/LogoutView.vue"),
    meta: { authRequired: true },
  },
  {
    path: "/game/:gameId",
    name: "Game",
    component: () =>
      import(/* webpackChunkName: "game" */ "../dd5e/views/GameDD5eView.vue"),
    props: (route) => {
      return { gameId: route.params.gameId };
    },
    meta: { authRequired: true },
  },
  {
    path: "/about",
    name: "About",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
    meta: { authRequired: false },
  },
  {
    path: "/gdpr",
    name: "GDPR",
    component: () =>
      import(/* webpackChunkName: "gdpr" */ "../views/GDPRView.vue"),
    meta: { authRequired: false },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  const authRequired = to.matched.some((record) => record.meta.authRequired);
  logger.info(
    `Navigate from ${from.name} to ${to.name}, authRequired: ${authRequired}`
  );
  if (!authRequired) {
    next();
    return;
  }
  const authenticated = store.getters["auth/authenticated"];
  if (authenticated) {
    logger.info(
      `User ${store.getters["auth/userId"]}, verified ${store.getters["auth/verified"]}`
    );
    next();
    return;
  }
  logger.info(
    `User is not logged in, abort navigation to ${to.name}, go to login [${authenticated}]`
  );
  next({ name: "Login" });
});

export default router;

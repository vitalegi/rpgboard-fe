import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import AuthService from "@/login/services/AuthService";
import { factory } from "@/utils/ConfigLog4j";
import Container from "typedi";
const logger = factory.getLogger("Router");

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "SelectGame",
    component: () =>
      import(/* webpackChunkName: "login" */ "../game/view/SelectGameView.vue"),
  },
  {
    path: "/login",
    name: "Login",
    component: () =>
      import(/* webpackChunkName: "login" */ "../login/views/LoginView.vue"),
  },
  {
    path: "/logout",
    name: "Logout",
    component: () =>
      import(/* webpackChunkName: "logout" */ "../login/views/LogoutView.vue"),
  },
  {
    path: "/game/:gameId",
    name: "Game",
    component: () =>
      import(/* webpackChunkName: "game" */ "../dd5e/views/GameDD5eView.vue"),
    props: (route) => {
      return { gameId: route.params.gameId };
    },
  },
  {
    path: "/about",
    name: "About",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
  {
    path: "/gdpr",
    name: "GDPR",
    component: () =>
      import(/* webpackChunkName: "gdpr" */ "../views/GDPRView.vue"),
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
  const authService = Container.get<AuthService>(AuthService);
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

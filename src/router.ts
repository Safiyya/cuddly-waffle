import Vue from "vue";
import Router from "vue-router";
import HomePage from "./views/Home.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "home",component: () => import(/* webpackChunkName: "results" */ "./views/Results.vue"),
    }
  ],
});

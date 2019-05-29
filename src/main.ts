import Vue from "vue";
import AppVue from "./App.vue";
import router from "./router";

import "normalize.css/normalize.css";
import "@/assets/tailwind.css";
import "@/assets/styles.css";
import VueSimpleSVG from "vue-simple-svg";


Vue.use(VueSimpleSVG);


Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(AppVue),
}).$mount("#app");

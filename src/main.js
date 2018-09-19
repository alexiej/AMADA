import Vue from "vue";
import Vuex from "vuex";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import { amada } from "./amada.js";
import { get_app_folder, is_dev } from "./electron";

Vue.config.productionTip = false;
Vue.use(ElementUI);

Vue.prototype.$amada = amada;
Vuex.Store.prototype.$amada = amada;
var folder = get_app_folder();
Vue.prototype.$app_dir = folder;
Vuex.Store.prototype.$app_dir = folder;

// amada.$router = router;
// console.log(amada);
console.log(is_dev(), folder);

let vue = new Vue({
  router,
  store,
  render: h => h(App)
});

vue.$mount("#app");

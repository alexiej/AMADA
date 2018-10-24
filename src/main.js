import Vue from "vue";
import Vuex from "vuex";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import { amada } from "./amada.js";
import { get_app_folder } from "./electron";
import EditorView from "./amada/views/EditorView";

Vue.config.productionTip = false;
Vue.use(ElementUI);

// console.log(store.state.project);
// console.log(store.state.project);
// console.log(amada);

let editor_view = new EditorView(amada, "editor/-", store.state.project.file); //empty editor view
// console.log(editor_view);
store.state.editor_view = editor_view;

Vue.prototype.$amada = amada;
Vuex.Store.prototype.$amada = amada;
var folder = get_app_folder();
Vue.prototype.$app_dir = folder;
Vuex.Store.prototype.$app_dir = folder;

String.prototype.format = function() {
  return [...arguments].reduce((p, c) => p.replace(/%s/, c), this);
};

String.form = function(str, arr) {
  var i = -1;
  function callback(exp, p0, p1, p2, p3, p4) {
    if (exp == "%%") return "%";
    if (arr[++i] === undefined) return undefined;
    exp = p2 ? parseInt(p2.substr(1)) : undefined;
    var base = p3 ? parseInt(p3.substr(1)) : undefined;
    var val;
    switch (p4) {
      case "s":
        val = arr[i];
        break;
      case "c":
        val = arr[i][0];
        break;
      case "f":
        val = parseFloat(arr[i]).toFixed(exp);
        break;
      case "p":
        val = parseFloat(arr[i]).toPrecision(exp);
        break;
      case "e":
        val = parseFloat(arr[i]).toExponential(exp);
        break;
      case "x":
        val = parseInt(arr[i]).toString(base ? base : 16);
        break;
      case "d":
        val = parseFloat(
          parseInt(arr[i], base ? base : 10).toPrecision(exp)
        ).toFixed(0);
        break;
    }
    val = typeof val == "object" ? JSON.stringify(val) : val.toString(base);
    var sz = parseInt(p1); /* padding size */
    var ch = p1 && p1[0] == "0" ? "0" : " "; /* isnull? */
    while (val.length < sz)
      val = p0 !== undefined ? val + ch : ch + val; /* isminus? */
    return val;
  }
  var regex = /%(-)?(0?[0-9]+)?([.][0-9]+)?([#][0-9]+)?([scfpexd%])/g;
  return str.replace(regex, callback);
};

String.prototype.regex = function() {
  return String.form(this, Array.prototype.slice.call(arguments));
};

Vue.mixin({
  filters: {
    capitalize: function(value) {
      if (!value) return "";
      value = value.toString();
      return value.charAt(0).toUpperCase() + value.slice(1);
    },
    format: function(value, format_string) {
      return format_string.format(value);
    }
  }
});

let vue = new Vue({
  router,
  store,
  render: h => h(App)
});

vue.$mount("#app");

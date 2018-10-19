import Vue from "vue";
import { mapActions, mapState, mapGetters, mapMutations } from "vuex";
import store from "./store";
import router from "./router";
import { file } from "./amada/file";
import { keys } from "./amada/keys";
import { actions } from "./amada/actions";
import { views } from "./amada/views";

export const amada = new Vue({
  data() {
    return {
      counter: 0,
      components: {}
    };
  },
  created() {
    // window.addEventListener("keypress", this.key_press);
    window.addEventListener("keydown", this.key_press);
  },
  router,
  store,
  computed: {
    ...mapState(Reflect.ownKeys(store.state)),
    ...mapGetters(Reflect.ownKeys(store.getters))
  },
  methods: {
    ...mapMutations(Reflect.ownKeys(store._mutations)),
    ...mapActions(Reflect.ownKeys(store._actions)),
    ...file,
    ...keys,
    ...actions,
    ...views,
    components_connect(component, view) {
      view._component_id = component._uid;
      this.components[component._uid] = component;
    },

    get_id() {
      this.counter += 1;
      return this.counter;
    }
  }
});

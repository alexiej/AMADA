import Vue from "vue";
import Vuex from "vuex";
import {
  project,
  models,
  schemas,
  keys,
  editor_view,
  about
} from "./amada/init.js";
import { file_actions } from "./amada/file_actions";
import { views_mutations } from "./amada/views_mutations";
Vue.use(Vuex);

export default new Vuex.Store({
  stric: true,
  state: {
    // files: {}, //this is all files loaded in the js

    project_empty: project,
    project: project, //current folder and project connected with the whole application

    view: about, //current content view connected with the state, class for view
    editor_view: editor_view, //current editor view, we can send to an editor what we want
    editor_views: [], //list of editor views

    views: {}, //list all registered views than we can make an action

    models: models,
    keys: keys,
    schemas: schemas //list of schemas for files
  },
  mutations: {
    ...views_mutations
  },
  actions: {
    ...file_actions
  }
});

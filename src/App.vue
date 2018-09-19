<template>
  <div id="window">
    <div id="titlebar"
    :class="{
      'focused': isFocused2
      }"
    >
      <i class="far fa-eye primary"></i>
              <span class="directory text-cut">{{$amada.editor_view.file.directory}}</span>

            
      

        <strong class="slash">\</strong>
        <span class="name">{{$amada.editor_view.file.name}}</span>
    

      <div class="buttons">
        <el-button type="warning" @click="dev" plain icon="el-icon-edit-outline" circle/>
        <el-button type="primary" @click="maxApp" plain icon="el-icon-rank" circle/>
        <el-button type="danger" @click="closeApp" plain icon="el-icon-close" circle/>
      </div>

    </div>
    <div id="navbar">
      <button class="borderless primary">
        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAATZSURBVGhD7ZdtaJVlGMfNgtKgskCUfEM33Zpuikc3dbKc002mqG2raXNTN+dmBgt8qQ92LCZomG3qh9KMJty2jZ3Nec7ceVHPtqO9wMKwlCBTstHLl1CCQMj/1X0dLgl8jnDgvs/pQ/vBn+e+nudw/c7/wzk7GzHMMMPYYXwtjZ74GpY9v53KbGXCNhRNraWnRZF4Jm+jcVPqcWPKNiLbmVyP3ybVY6GoEktKHRp1kLIV1an1VGAret+3KXVEOrenJaNM2haotFq6LaM19N7IjC34VV+HeL8+J7ZMRg1URo39IjNrENG7r2TWYLq+DrEjI5FlsjZDZW22X2R2NSI6V/jMZfR5iD2zE1XGtQnKtdF+EddGRPTuaBFm3gZMn7sJQ+zSz+yXya6Eyqm0XyS7ivpyqnBNxihcJrsKQ+xbYLtMri6yaIP9Irkb0KRzT+//YFEldt+Pnk/kVhKxc2ElpsnLzcmrgMqrsF9keSme1bsDea/i3osVRLGD9+Tl5ixdB1Ww3n6R++SUYlTxehrzYLT3DrvlZeYUlUMVlSeuyMNgJ7tlNKf4ZaiVryS/CDvZLaM5a0qhVpfFLrLzIpbo9Or4dkWQI7etwE52y2hOSQlUyUvOIgf7MfHQBfx1KIzf9fUPzpEQnnOH6Ql3hAriy8PLs5PdMppTvhaqfK2zSKsfJa0Bos8CWNEWxLroOYil7SGadEqf44r/3z+ID8JOdstoTsUaqIrVziIRH03t9+Kuzk8DZ/DLgBd/XvJg7OAZGv19J5XFk2udWC7rHLCT3TKaU7UKqmpV7M/IdQ+Kr3fgix88GNDnfLltBXayW0ZzaoqhqlfGLpJI2MluGc3ZqpfVFccuUncJY1+/hN06O+ojNEZuW4Gd7JbRnO1FUNtXOIu4v8RT+/twc38fUTRhXG0+i8flsTHsZLeM5jQUQjUUOou0hLC6JUh0MkAbW4Jo4LO+5jXpb60jF4jiyeHzD//WYie7ZTRn5zKoHcucRc55MT/kIwr50BP0IRz0Av5upNzsomdudtD+uOJBg6xzwE52y2jOm/lQb+XH/ox814l9On9f7cTdq13YJbetwE52y2jOHr1sz5LYRZhvTuLJW20YJaM12MluGc3Zmwe1Ny92ETfRyDf0z4yGi3DJLWuwk90ymtO4GKpxsbNIezs9uncAvncGiKLpxyl5ZAV2sltGcw7kQh1Y5Czysf5ddfwc0bFzaD4Wwid8Pn6B5rr135a3+xGKJ+5+HJN1DtjJbhnNObgQ6v0YRby9KOw5S+Q7i309PTjMZ68f87/y0bivT9NgPBk8jVZZ54Cd7JbRnOYFUE0LnEXCYXrschf6L58miqYL3UT0iDw2hp3sltGco9lQR7Njf9hJl7nVgcKf25BPbhopt63ATnbLaM6HLqiP5sUukkjYyW4ZzTmhl51wJb8IO9ktozmfzoFqmZP8Iuxkt4zmqCwolZX8Iuxkt4zmtGZCtWXijoxJg53sltEcz0wozywifW3smEW1yQi7xGmvSHcGVHcG0X8Ti0V86VA6d7zpSPWl0dxkJOrSTnbL2zAnkIZGfxoQSEd1bzoVJCPsYqd/Bt6Vt2FO+AUadz4VN85PJ0pu8CO75W3YYXA8jQ6nUkFfCpUlI+z6fIL9f9aGGeb/yYgR/wDJZ/PkFi4bwgAAAABJRU5ErkJggg==">
      </button>
      <button class="borderless primary">
        <img src="data:image/png;base64,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">
      </button>

    </div>
    <div id="sidebar">
      <files-view/>
    </div>
    <div id="app">
      <!-- <div id="nav">1
        <router-link to="/">Home</router-link> |
        <router-link to="/about">About</router-link>
      </div> -->
      <router-view/>
    </div>
  </div>

</template>
<script>
var bw = require("electron").remote.getCurrentWindow();
import FilesView from "./navs/FilesView";

import Vue from "vue";
import { toggleDev } from "./electron.js";


import Inline from "./components/AmadaEditor/Inline";
import Line from "./components/AmadaEditor/Line";
import Section from "./components/AmadaEditor/Section.vue";


Vue.component('amada-line', Line)
Vue.component('amada-inline', Inline)
Vue.component('amada-section',Section)

import {get_folder} from './electron.js';

// console.log(get_folder());
// console.log(__dirname);

export default {
  data() {
    return {
      name: "",
      directory: "",
      isFocused2: false
    };
  },
  components: {
    "files-view": FilesView
  },

  mounted() {
    let v = this;
    this.isFocused2 = bw.isFocused();

    bw.on('blur', (e, cmd) => {
      v.isFocused2 = false;
    })
    bw.on('focus', (e,cmd) => {
      v.isFocused2 = true;
    })

  },
  methods: {
    dev() {
      toggleDev();
    },
    closeApp() {
      bw.close();
    },
    maxApp() {
      if (bw.isMaximized()) {
        bw.unmaximize();
      } else {
        bw.maximize();
      }
    }
  }
};
</script>


<style lang="scss">
@import "@/scss/pages/app.scss";
</style>

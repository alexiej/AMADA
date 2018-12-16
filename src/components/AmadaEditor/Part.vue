<template>
   <div  
    :id="part_view._component_id"
    ref = "editor"
    class="amada-part" 
    >
        <span ref="text-width" style="visibility: hidden; position: absolute;">W</span>
        <amada-cursor ref="cursor"/>

        <div class="amada-content" >
          <amada-code 
          ref="amada-code"
          :class="[part_view.section==part_view.cursor ? 'selected-code' : '']"
          :code="part_view.section" :part_view="part_view" />
      </div>

 </div>
</template>
<script>
import ace from "../ace/ace";
import { __isempty } from "../../__helpers.js";
import Vue from 'vue';

function getTotal(a,parent) {
  var b = 0, c = 0;
  while (a!=parent) {
      b += a.offsetLeft;
      c += a.offsetTop;
      a = a.offsetParent;
  }
  return [b,c];
}


function getTextWidth(text, font) {
  // if given, use cached canvas for better performance
  // else, create new canvas
  var canvas = document.createElement("canvas");
  var context = canvas.getContext("2d");
  context.font = font;
  var metrics = context.measureText(text);
  return metrics.width;
}



export default {
  props: ["part_view"],
  components: {
    ace: ace
  },
  // components: {
  //   'amada-codes': Codes
  // },
  data() {
    return {
      text_width: 12,
      text_height: 0,
      pos: 0,
      top: 0,
      left: 0,
      // code_section: "amada-section",
      mode: 0, // in this mode we view elements, 1 - edit mode
      lineSize: 24
    };
  },

  mounted() {
    // console.log();
    let el = this.$refs["text-width"];
    this.text_width = el.getBoundingClientRect().width;
    this.text_height = el.getBoundingClientRect().height;
    this.$amada.components_connect(this, this.part_view);
  },
  methods: {
    // scroll_top() {
    //   let n = (this.part_view.top - 5) * this.lineSize;
    //   this.$el.scrollTop = n <= 0 ? 0 : n;
    // },

    cursor_next_line(code, id, text) {
      var element = document.getElementById(id);
      if (element == undefined) return;
    },

    cursor_to_code(code_key, text, pos = 0) {
      // console.log(code_key,text,pos);
      var v = this;
      Vue.nextTick(function() {
         var element = document.getElementById(code_key);
         if (element == undefined) return;

        element.textContent =  text.substr(0, pos) ; //text.substr(0, pos);
        
        var cursor = v.$refs["cursor"];
        var parent = v.$refs["editor"];

        element.appendChild(cursor.$el);
        let top = element.offsetTop +  cursor.$el.offsetTop;
        let left = getTotal(cursor.$el, parent) ;
        // console.log(left);
  
        element.appendChild(document.createTextNode(text.substr(pos)));
        v.$el.scrollTop = top  - 5 * v.lineSize;
        v.$el.scrollLeft = left[0]  - 150;
      })
    },

    scroll_to_code(code) {}
  }
};
</script>

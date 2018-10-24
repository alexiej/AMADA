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
          :class="[part_view.code_view==part_view.cursor_line ? 'selected-line' : '',
                    part_view.code_view==part_view.cursor_code ? 'selected-code' : '']"
          :code_view="part_view.code_view" :part_view="part_view" />
      </div>


 </div>
</template>
<script>
import ace from "../ace/ace";
// import Codes from './Codes';
import { __isempty } from "../../__helpers.js";
import Vue from 'vue';

function getTextWidth(text, font) {
  // if given, use cached canvas for better performance
  // else, create new canvas
  var canvas = document.createElement("canvas");
  var context = canvas.getContext("2d");
  context.font = font;
  var metrics = context.measureText(text);
  return metrics.width;
}

function findClickedWord(parentElt, x, y) {
  if (parentElt.nodeName !== "#text") {
    console.log("didn't click on text node");
    return null;
  }
  var range = document.createRange();
  var words = parentElt.textContent.split(" ");
  var start = 0;
  var end = 0;
  for (var i = 0; i < words.length; i++) {
    var word = words[i];
    end = start + word.length;
    range.setStart(parentElt, start);
    range.setEnd(parentElt, end);
    // not getBoundingClientRect as word could wrap
    var rects = range.getClientRects();
    var clickedRect = isClickInRects(rects);
    if (clickedRect) {
      return [word, start, clickedRect];
    }
    start = end + 1;
  }
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

    // console.log('W',this.text_width,this.text_height);
    // var element = document.getElementById(this.part_view._component_id);
    // console.log(element);
    // this.text_width = getTextWidth('A',);

    this.$amada.components_connect(this, this.part_view);
  },
  methods: {
    scroll_top() {
      // this.cursorTopPosition = this.fileView.line * this.lineSize
      // this.cursorLeftPosition = this.measureText(this.fileView.lineText)
      let n = (this.part_view.top - 5) * this.lineSize;
      this.$el.scrollTop = n <= 0 ? 0 : n;
    },

    cursor_next_line(code, id, text) {
      var element = document.getElementById(id);
      if (element == undefined) return;
    },

    cursor_to_code(code_view, pos = 0) {
      var v = this;
      Vue.nextTick(function() {
         var element = document.getElementById(code_view.edit_id);
         if (element == undefined) return;

        let text = code_view.edit_text;

        element.textContent =  text.substr(0, pos); //text.substr(0, pos);
        var cursor = v.$refs["cursor"];
        element.appendChild(cursor.$el);
  
        element.appendChild(document.createTextNode(text.substr(pos)));
        v.$el.scrollTop = cursor.$el.offsetTop - 5 * v.lineSize;
        v.$el.scrollLeft = cursor.$el.offsetLeft - 155;

      })
      // this.next
      // var element = document.getElementById(code_view.edit_id);
    },

    scroll_to_code(code) {}
  }
};
</script>

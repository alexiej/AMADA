<template>
   <div  
    :id="part_view._component_id"
    ref = "editor"
    class="amada-part" 
    >

    <div class="amada-lines">
      <div class="line-number"
      :class="[c.model.name]"
      v-for="(c, index) in part_view.code_lines"
      :key="index"
      >{{index}}</div>
    </div>
    <div class="amada-content">
       <div class="animate-flicker cursor" 
            :class="{
              'edit':  mode==1
            }"
            style=" width: 10.2594px; height: 22px;" 
            :style="{
          'top': top+'px',
          'left': left + 'px'
          }"></div>

      <amada-section :code="part_view.part.section" :part_view="part_view" />
      
      <!-- <amada-codes :codes="part_view.part.codes"/> -->

   
      <div style="background: rgba(128,128,128,0.02); margin-right: 5px; height: 30vh;">
      </div>
    </div>
 </div>
</template>
<script>
import Codes from './Codes';

export default {
  props: ["part_view"],
  components: {
    'amada-codes': Codes
  },
  data() {
    return {
      top: 0,
      left: 0,
      // code_section: "amada-section",
      mode: 0, // in this mode we view elements, 1 - edit mode
      lineSize: 24,
    };
  },  

  mounted() {
    console.log(this.part_view);
    this.$amada.components_connect(this, this.part_view);
  },
  methods: {
    scroll_top() {
      // this.cursorTopPosition = this.fileView.line * this.lineSize
      // this.cursorLeftPosition = this.measureText(this.fileView.lineText)
      let n = (this.part_view.top - 5) * this.lineSize
      this.$el.scrollTop = n <= 0 ? 0 : n
    },

    cursor_to_code(code) {
      var element = document.getElementById(this.part_view.id + "/" + code.id);
      // var rect = element.getBoundingClientRect();
      this.top = element.offsetTop;
      this.left = element.offsetLeft;
      this.$el.scrollTop = element.offsetTop - 5*this.lineSize;

      this.scroll_to_code(code);
    },

    scroll_to_code(code) {
      

    }
  }
};
</script>

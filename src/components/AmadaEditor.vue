
<template >
    <div  class="amada-editor" :class="['editor-'+editor_view.mode]">

      <div class="amada-tabs">
           <el-tabs :value="editor_view.part_view_id" 

                      ref="amada-tabs"
                      @input="set_current_part($event)"

                      class="amada-tab" >
                 
                        <el-tab-pane 
                        ref="tab-pane"
                        :label="pv.name" 
                        :key="pv.name" 
                        :name="pv.name" 
                        v-for="pv in editor_view.part_views">
                              <apart :part_view="pv" >
                              </apart>
                          </el-tab-pane>
                      </el-tabs> 
      </div>
   <div class="amada-preview">
    <!-- <ace 
    v-if="editor_view.part_view.preview_visible"
    class="amada-preview"
       :content="editor_view.part_view.editor_view.code_preview" 
                    theme="xcode" 
                    :lang="editor_view.part_view.editor_view.lang"
        name="amada-preview2"

            > </ace> -->
   </div>


    </div>
</template>
<script>
import ace from "./ace/ace";
import Part from "./AmadaEditor/Part";

export default {
  data() {
    return {
      tab_id: ""
    };
  },
  props: ["editor_view"],
  mounted() {
    this.$amada.components_connect(this, this.editor_view);

// this.$refs['amada-tabs'].$el.addEventListener("keyPress", function(event){
//     event.preventDefault()
// });


    console.log('foc',this.$refs['tab-pane'] );
  },
  components: {
    ace: ace,
    apart: Part
  },
  methods: {
    set_current_part(pane) {
      // console.log(pane);
      let el = document.getElementById("pane-" + pane);
      if(el!=undefined) {
        console.log(el);
        el.blur();
        // el.firstChild.contentEditable=true; //<- Don't use this. It allow user to edit content
        el.firstChild.focus();
      }
      // console.log('el', el.firstChild);
       this.editor_view.set_part_view_id(pane)
    }
  }
};
</script>


<template >
    <div  class="amada-editor">
        <el-tabs v-model="editor_view.part_view_id" 
         class="amada-tab" >
           <el-tab-pane 
           :label="pv.name" 
           :key="pv.id" 
           :name="pv.id" 
           v-for="pv in editor_view.part_views">
                <apart :part_view="pv" >
                </apart>
            </el-tab-pane>
            
            
      <!--
           <el-tab-pane 
           label="ace" 
           name="ace" 
           >
           <ace name="editor" content="some text" lang="js" theme="darcula" >
     </ace>
            </el-tab-pane>
            
            -->
        </el-tabs>
    </div>
</template>
<script>
import ace from "./ace/ace";
import Part from "./AmadaEditor/Part";

export default {
  data() {
    return {
      tab_id: ""
    }
  },
  props: ["editor_view"],
  mounted() {
    this.$amada.components_connect(this, this.editor_view);
  },
  components: {
    ace: ace,
    apart: Part
  },

};
</script>

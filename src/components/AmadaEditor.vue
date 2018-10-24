
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
   <div class="amada-preview"  v-if="editor_view.part_view.preview_visible">
    <ace 
    class="amada-preview"
       :content="editor_view.part_view.editor_view.code_preview" 
                    theme="xcode" 
                    :lang="editor_view.part_view.editor_view.lang"
        name="amada-preview2"> </ace>
   </div>
   <div class="amada-properties">
     <div class="title">
      {{editor_view.part_view.cursor_code.model.name}}:{{editor_view.part_view.cursor_code.display_key}}
    </div>

    <div class="amada-allowed" v-show="editor_view.is_allowed">
      <el-input v-model="search"
       @keyup.enter.native="allowed_update(filteredItems[0])"
       type="text" size="medium" ref="allowed-input"/>
      <div class="item" 
      v-for="l in filteredItems" :key="l.id">
        <el-button @click="allowed_update(l)" :type="filteredItems[0] == l ? 'primary' : ''" plain >{{l.name}}</el-button>
      </div>
    </div>
  </div>


    </div>
</template>
<script>
import ace from "./ace/ace";
import Part from "./AmadaEditor/Part";

export default {
  data() {
    return {
      items: [],
      search: ''
    };
  },
  props: ["editor_view"],
  mounted() {
    this.$amada.components_connect(this, this.editor_view);
  },
  components: {
    ace: ace,
    apart: Part
  },
  computed: {
      filteredItems() {
        return this.items.filter(item => {
          return item.name.toLowerCase().indexOf(this.search.toLowerCase()) > -1
        })
      }
  },
  methods: {
    allowed_update(ev) {
      if(this.filteredItems.length<=0) return;
      this.editor_view.allowed_select(ev);

    },
    set_allowed() {
      this.name = '';
      this.items = Object.values(this.editor_view.allowed_list);

      let el = this.$refs['allowed-input'];//.$refs['input'];
      el.select();
      el.focus();
      let inp = el.$refs['input'];
      inp.select();
      inp.focus();
      this.$nextTick(() => el.$refs.input.focus())
   
  //  console.log(el.focused);
      // console.log(el.$refs['input'].focus());
      // el.$el.focus();
      // el.focus();
      
    },

    set_current_part(pane) {
      // console.log(pane);
      let el = document.getElementById("pane-" + pane);
      if(el!=undefined) {
        // console.log(el);
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

<template>
     <span 
  :class="[view.component_class, view.view_class, code==part_view.cursor ? 'selected-code' : '']"  
  class="amada-content" ><span class="header val" :id="val_id"   
  :class="{'edited': val_id == part_view.edit_id }" >{{code.val}} </span>
       <span v-if="code.has_codes" class="codes">
            <component  :key="c.id" 
                        :part_view="part_view"
                        :class="[c==part_view.cursor ? 'selected-code' : '']"
                        v-for="c in code.codes" 
                        :code="c"
                        v-bind:is="part_view.template[c.view_id].component_name">
            </component>
        </span>
  </span> 
</template>
<script>
export default {
  name: "amada-content",
  props: ["code", "part_view"],
  computed: {
    view() {
      return this.part_view.template[this.code.view_id];
    },
    val_id() {
      return this.part_view.id + "/" + this.code.val_id;
    }
  }
};
</script>
<style scoped>
span,
div {
  position: relative;
  vertical-align: top;
  white-space: pre;
  min-height: 23px;
}



.selected-code {
  /* display: inline-block !important; */
  padding-right: 15px;
}
</style>
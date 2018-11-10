<template>
     <span 
  :class="[code_view.component_class, code_view.code_class,  
  code_view==part_view.cursor_code ? 'selected-code' : '']"  
  class="amada-content" ><span class="header val" :id="code_view.val_id"   :class="{'edited': code_view.val_id == code_view.edit_id }" >{{code_view.edit_text}}</span>
        <span v-if="code_view.has_codes" class="codes">
            <component  :key="cv.id" 
                        :part_view="part_view"
                        :class="[cv==part_view.cursor_code ? 'selected-code' : '']"
                        v-for="cv in code_view.codes" 
                        :code_view="cv"
                        v-bind:is="cv.component_name">
            </component>
        </span>
  </span> 
</template>
<script>
export default {
  name: "amada-content",
  props: ["code_view", "part_view"],
  getters: {
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
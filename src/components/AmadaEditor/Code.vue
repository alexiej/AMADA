<template>
  <div 
  :class="[view.component_class, view.view_class]"  
  class="amada-code" :id="id">
    <span v-if="view.has_header" class="header">
      <span v-if="view.header.prefix!=''">{{view.header.prefix}}</span>
      <span 
      v-if="view.header.display_val!=''" 
      :id="id"
      :class="{'edited': code_view.val_id == code_view.edit_id }"
      class="val">{{code[view.header.display_val]}}</span>

      <span v-if="code_view.has_properties" class="properties">
          <span class="prefix">{{code_view.properties.prefix}}</span>
          <span v-for="pv in code_view.props" :key="pv.id"
             :id="pv.id"
             class="property"
             :class="[pv.component_class,
                      pv.code_class, pv==part_view.cursor_line ? 'selected-line' : '',
                     pv==part_view.cursor_code ? 'selected-code' : '']"
          > 
            <span class="prefix">{{pv.property.prefix}}</span>
            <span class="key" :id="pv.key_id" :class="{'edited': pv.key_id == pv.edit_id }"  >{{pv.value[pv.property.display_key]}}</span>
              <span class="between">{{pv.property.between}}</span>
             <span  class="val" :id="pv.val_id"  :class="{'edited': pv.val_id == pv.edit_id }"  >{{pv.value[pv.property.display_val]}}</span>   
             <span class="suffix">{{pv.property.suffix}}</span>

             <span v-if="!pv.is_last">{{  pv.property.list_div}}</span>
          </span>


        <span class="suffix">{{code_view.properties.suffix}}</span>
      </span>
      <span v-if="code_view.header.suffix!=''">{{code_view.header.suffix}}</span>
    </span>


    <span v-if="code_view.has_codes" class="codes">
        <component  :key="cv.id" 
                    :part_view="part_view"
                    :class="[cv==part_view.cursor_code ? 'selected-code' : '']"
                    v-for="cv in code_view.codes" 
                    :code_view="cv"
                    v-bind:is="cv.component_name">
        </component>
    </span>


    <span v-if="view.has_footer" class="footer">
        <span v-if="view.footer.prefix!=''">{{view.footer.prefix}}</span>
      <span v-if="view.footer.display_val!=''" :id="code_view.val_id + '-footer'" >{{code_view.value[code_view.footer.display_val]}}</span>  
      <span v-if="view.footer.suffix!=''">{{view.footer.suffix}}</span>
    </span>
  </div>
</template> 
<script>
export default {
  name: "amada-code",
  data() {
    return {
      edit_key: ''
    }
  },
  props: ["code_view", "part_view"],
  computed: {
    code() {
      return this.code_view.code;
    },
    view() {
      return this.part_view.template[this.code_view.code.view_id];
    },

    id() {
      return this.part_view.id + "/" + this.code_view.code.id;
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
  min-height: 22px;
}

.amada-code {
  display: inline-block;
}

.selected-code {
  /* display: inline-block !important; */
  padding-right: 15px;
}
</style>

<template>
  <div 
  :class="[view.component_class, view.view_class]"  
  class="amada-code" :id="id">
    <span v-if="view.has_header" class="header">
      <span v-if="view.header.prefix!=''">{{view.header.prefix}}</span>
      <span 
      v-if="view.header.display_val!=''" 
      :id="val_id"
      :class="{'edited': val_id == part_view.edit_id }"
      class="val">{{code.val}}</span>

      <span v-if="code.has_properties" class="properties">
          <span class="prefix">{{view.properties.prefix}}</span>
          <span v-for="p in code.properties" :key="p.id"
             :id="p.id"
             class="property"
             :class="[p==part_view.cursor ? 'selected-code' : '']"
          > 
            <span class="prefix">{{view.property.prefix}}</span>
            <span class="key" :id="(part_view.id + '/' + p.key_id)" 
                :class="{'edited': (part_view.id + '/' + p.key_id) == part_view.edit_id }"  >{{p.key}}</span>
              <span class="between">{{view.property.between}}</span>
             <span  class="val" :id="(part_view.id + '/' + p.val_id)"  
             :class="{'edited': (part_view.id + '/' + p.val_id) == part_view.edit_id }"  >{{p.val}}</span>   
             <span class="suffix">{{view.property.suffix}}</span>

             <span v-if="!p.is_last">{{  view.property.list_div}}</span>
          </span>


        <span class="suffix">{{view.properties.suffix}}</span>
      </span>
      <span v-if="view.header.suffix!=''">{{view.header.suffix}}</span>
    </span>


    <span v-if="code.has_codes" class="codes">
        <component  :key="c.id" 
                    :part_view="part_view"
                    :class="[c==part_view.cursor ? 'selected-code' : '']"
                    v-for="c in code.codes" 
                    :code="c"
                    v-bind:is="part_view.template[c.view_id].component_name">
        </component>
    </span>

    <span v-if="view.has_footer" class="footer">
        <span v-if="view.footer.prefix!=''">{{view.footer.prefix}}</span>
      <span v-if="view.footer.display_val!=''" :id="code.id + '-footer'" >{{code.val}}</span>  
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
  props: ["code", "part_view"],
  computed: {
    view() {
      return this.part_view.template[this.code.view_id];
    },

    id() {
      return this.part_view.id + "/" + this.code.id;
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

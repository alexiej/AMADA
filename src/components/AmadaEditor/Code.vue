<template>
  <div 
  :class="[code_view.component_class, code_view.code_class]"  
  class="amada-code" :id="code_view.id">
    

    <span v-if="code_view.has_header" class="header">

      <span v-if="code_view.header.prefix!=''">{{code_view.header.prefix}}</span>
      <template v-if="code_view.header.display_key!=''">
            <span :id="code_view.key_id"   class="key" >{{code_view.value[code_view.header.display_key]}}</span>
            <span >{{code_view.header.between}}</span>
      </template>
      <span v-if="code_view.header.display_val!='' && code_view.code.has_value" :id="code_view.val_id" class="val">{{code_view.value[code_view.header.display_val]}}</span>
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
            <span class="key" :id="pv.key_id" >{{pv.value[pv.header.display_key]}}</span>
              <span class="between">{{pv.property.between}}</span>
             <span  class="val" :id="pv.val_id" >{{pv.value[pv.header.display_val]}}</span>   
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
                :class="[cv==part_view.cursor_line ? 'selected-line' : '',
                          cv==part_view.cursor_code ? 'selected-code' : '']"
                v-for="cv in code_view.codes" 
                :code_view="cv"
                v-bind:is="cv.component_name">
    </component>
</span>


    <span v-if="code_view.has_footer" class="footer">
        <span v-if="code_view.footer.prefix!=''">{{code_view.footer.prefix}}</span>
      <template v-if="code_view.footer.display_key!=''">
            <span :id="code_view.key_id"  >{{code_view.value[code_view.footer.display_key]}}</span>
            <span >{{code_view.footer.between}}</span>
      </template>
      <span v-if="code_view.footer.display_val!=''" :id="code_view.val_id" >{{code_view.value[code_view.footer.display_val]}}</span>  
      
      <span v-if="code_view.footer.suffix!=''">{{code_view.footer.suffix}}</span>
    </span>
  </div>
</template> 
<script>
export default {
  name: "amada-code",
  props: ["code_view", "part_view"],
  getters: {
    // header_key() {
    //   return code_view.header.key_type ? code_view.header.
    // }
  }
};
</script>
<style scoped>
span,
div {
  position: relative;
  vertical-align: top;
  white-space: pre;
  /* display: inline-block; */
  /* width: 100%; */
  /* width: 100%; */
  /* overflow: hidden; */
  /* white-spaceje: normal;  */
}
.selected-code {
  display: inline-block !important;
  padding-right: 15px;
}
</style>

<template>
  <div :class="code.model.name" >
      <div class="amada-line header">{{code.name}}</div>
      <div class="codes">
        <component :key="c.id" 
                      :part_view="part_view"
                                      :class="{'selected-line': c==part_view.cursor_line,'selected-code':c==part_view.cursor_code}"

                    class="section-content"
                    v-for="c in code.codes" :code="c"
                    v-bind:is="c.model.component_name">
          </component>
      </div>
     <div class="amada-line footer">{{code.name}}</div>
  </div>

</template>
<script>

export default {
  name: "amada-section",
  props: ["code","part_view"]
};
</script>

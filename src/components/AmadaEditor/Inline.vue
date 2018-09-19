<template>
  <div :class="code.model.name">
    <span class="amada-inline">{{code.name}}</span>
      <!-- <span class="content">{{code.name}}</span> -->
    <component :key="c.id" 
     :part_view="part_view"
                      :class="{'selected-line': c==part_view.cursor_line,'selected-code':c==part_view.cursor_code}"

              v-for="c in code.codes" :code="c"
              v-bind:is="c.model.component_name">
    </component>
  </div>
</template>
<script>
export default {
  name: 'amada-inline',
  props: ['code',"part_view"]
}
</script>

<template>
  <div :class="[container_class]"  v-if="codes.length>0">
      <component :key="(part_view.id + '/' + c.id)" 
                    :part_view="part_view"
                    :class="[c==part_view.cursor_line ? 'selected-line' : '',
                             c==part_view.cursor_code ? 'selected-code' : '']"
                    v-for="c in codes" 
                    :code="c"
                    v-bind:is="c.model.component_name">
        </component> 
  </div>
</template>
<script>


export default {
  props: ['container_class', 'codes',"part_view"],

  
}
</script>

<template>
  <div class="amada-codes" >
      <component :key="c.id" 
       :part_view="part_view"
                        :class="{'selected-line': c==part_view.cursor_line,'selected-code':c==part_view.cursor_code}"

              v-for="c in codes" :code="c"
              v-bind:is="c.model.component_name">
    </component>
  </div>
</template>
<script>
import Inline from "./Inline";
import Line from "./Line";
import Section from "./Section.vue";

export default {
  props: ['codes',"part_view"],
  components: {
  "amada-line": Line,
  "amada-inline": Inline,
  "amada-section": Section
 }
}
</script>

<template>
  <div :class="[code.model.component_class, code.item_class]"    :id="(part_view.id + '/' + code.id)">
      <span>{{code.value}}</span>
      <amada-codes :container_class="code.header_class" v-if="code.has_header" :codes="code.headers" :part_view="part_view"/>
      <amada-codes :container_class="code.codes_class" v-if="code.has_codes" :codes="code.codes" :part_view="part_view"/>
      <amada-codes :container_class="code.footer_class" v-if="code.has_footers" :codes="code.footers" :part_view="part_view"/>

  </div>
</template>
<script>
export default {
  name: 'amada-inline',
  props: ['code',"part_view"]
}
</script>

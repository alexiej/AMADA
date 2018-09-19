<template>
<div id="home">

    <amada-editor 
    v-for="ev in $amada.editor_views"
    v-show="ev == $amada.editor_view"
    :key="ev.id"
    :editor_view="ev" />
</div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";
import AmadaEditor from "../components/AmadaEditor";

export default {
  name: "home",
  components: {
    "amada-editor": AmadaEditor
  }
};
</script>
<style lang="scss">
@import "@/scss/pages/home.scss";
</style>

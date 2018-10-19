<style lang="scss" scoped>
.el-button {
  margin-bottom: 1rem;
}
</style>

<template lang="pug">
  div 
    // some comments
    el-button(style="width: 100%", @click="showOpen")
      | Load File
    | {{$amada.editor_view.name}}:{{$amada.editor_view.part_view.name}}
    div
      file-info(v-for="ev in $amada.editor_views",:editor_view="ev")
</template>
<script>
import FileInfo from "./FilesView/FileInfo";

const { dialog } = require("electron").remote;

export default {
  data() {
    return {
      text: "text me"
    };
  },
  components: {
    "file-info": FileInfo
  },
  mounted() {},
  methods: {
    showOpen() {
      let f = dialog.showOpenDialog({
        message: "Open File"
      });
      if (f) this.$amada.file_open(f[0]);
    }
  }
};
</script>

<template>
  <div :id="name" style="width: 100%; height: 100%;"></div>
</template>
<script>
var ace = require("brace");
require("brace/mode/javascript");
require("brace/theme/monokai");
require("brace/theme/dracula");

export default {
  props: ["name", "content", "lang", "theme"],
  data() {
    return {
      editor: Object,
      beforeContent: ""
    };
  },
  watch: {
    content(value) {
      if (this.beforeContent !== value) {
        this.editor.setValue(value, 1);
      }
    }
  },
  mounted() {
    const lang = this.lang || "text";
    const theme = this.theme || "github";

    this.editor = ace.edit(this.name);
    this.editor.getSession().setMode("ace/mode/javascript");
    this.editor.setTheme("ace/theme/monokai");
    this.editor.setValue(this.content, 1);

    // mode-xxx.js or theme-xxx.jsがある場合のみ有効
    this.editor.getSession().setMode(`ace/mode/${lang}`);
    this.editor.setTheme(`ace/theme/${theme}`);
    this.editor.setOptions({
      fontFamily: "consolas",
      fontSize: "14pt"
    });

    this.editor.on("change", () => {
      this.beforeContent = this.editor.getValue();
      this.$emit("change-content", this.editor.getValue());
    });
  }
};
</script>

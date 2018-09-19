import EditorView from "./views/EditorView";

export const file_actions = {
  file_open: async function(context, path) {
    let file = await this.$amada.file_get(path);
    let editor_view = new EditorView("editor/" + file.path, file);

    context.commit("editor_view_add", editor_view);
    context.commit("editor_view_set", editor_view);

    this.$amada.$router.push("/"); //move to the amada edit file
    this.$amada.$emit("file_open", editor_view);
  }
};

export const views = {
  view_get(name) {
    switch (name) {
      case "editor":
        return this.editor_view;
      case "part":
      case "editor/part":
        return this.editor_view.part_view;
      default:
        return undefined;
    }
  }
};

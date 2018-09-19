export const views_mutations = {
  editor_view_set: function(state, editor_view) {
    state.editor_view = editor_view;
    state.view = editor_view;
  },

  editor_view_add: function(state, editor_view) {
    state.views[editor_view.id] = editor_view;
    state.editor_views.push(editor_view);
  },

  views_add: function(state, view) {
    state.views[view.id] = view;
  }
};

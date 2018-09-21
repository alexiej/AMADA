export const keys = {
  key_press(key) {
    //we need to check every view type for keys, or generate views for all view types
    //editor
    //editor/*/active
    //editor/mode
    //editor/mode/active
    var keys = [];
    let type_mode = this.view.type + "/" + this.view.mode;

    if (!(type_mode in this.keys)) {
      if (!(this.view.type in this.keys)) return;
      keys = this.keys[this.view.type];
    } else {
      keys = this.keys[type_mode];
    }

    if (!(key.key in keys)) return;
    var act = keys[key.key];

    // if (!this.view.mode_is(act.mode)) return;
    let target = this.view_get(act.target);
    if (target == undefined) return;

    if (!(act.action in target)) return;
    target[act.action](key, this, act.par);
  }
};

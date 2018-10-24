import { closingTagAncestorBreakers } from "himalaya/lib/tags";
import { insertArrayAt } from "../../code/__helpers";

const view_class = [
  "view-group",
  "view-value",
  "view-text",
  "view-line",
  "view-section"
];

function emptyif(text) {
  if (text === undefined || text == "") return "";
  return text;
}

export const VIEW_GROUP = -1;
export const VIEW_PROPERTY = 0;
export const VIEW_VALUE = 0;
export const VIEW_TEXT = 1;
export const VIEW_LINE = 2; //<- special section that contain a line
export const VIEW_SECTION = 3; //<-the whole section fo the view
// export const VIEW_SECTION = 2; //<-the whole section fo the view

export const SOURCE_TEXT = 0;
export const SOURCE_VAL = 1;

// class CodeShow {
//   constructor()
// }
function _keyval(type, display, value) {
  return type ? value[display] : display;
}

/**
 * This is a view for each code in the
 * The lowest value of the code, show how it is show in the template
 */
export class CodeView {
  constructor({
    id,
    part_view,
    code,
    value,
    template,
    type,

    component_class,
    component_name = "amada-code",
    is_select = true
  }) {
    this.id = id;

    this.part_view = part_view;

    this.parent = undefined;
    this.next = undefined;
    this.prev = undefined;

    this.code = code;
    this.value = value;

    this.type = type;
    this.template = template;
    this.component_name = component_name;
    this.component_class = component_class;
    this.props = [];
    this.codes = [];

    this.code_views = []; //<-this is all children

    this.is_select = is_select;

    if (this.is_property) {
      this.__defineGetter__("header", this.header_property);
    }

    this.val_id = id + "/" + this.header.display_val;
    this.key_id = id + "/" + this.header.display_key;
    this.edit_key = this.header.display_val;
  }

  __find_first_select(code_views) {
    for (let i = 0; i < code_views.length; i++) {
      if (code_views[i].is_select) return code_views[i];
    }
  }

  __find_last_select(code_views) {
    for (let i = code_views.length - 1; i >= 0; i--) {
      if (code_views[i].is_select) return code_views[i];
    }
  }

  delete(code_view, include_children) {
    let parent = code_view.parent;
    let i = parent.codes.indexOf(code_view);
    let iv = parent.code_views.indexOf(code_view);

    if (code_view.prev) {
      code_view.prev.next = code_view.next;
    }
    if (code_view.next) {
      code_view.next.prev = code_view.prev;
    }

    parent.codes.splice(i, 1);
    parent.code_views.splice(i, 1);

    if (!include_children) {
      if (!include_children) {
        let codes = code_view.codes;
        if (codes.length > 0) {
          if (code_view.prev) {
            let fs = this.__find_first_select(codes);
            if (fs) {
              fs.prev = code_view.prev;
              code_view.prev.next = fs;
            }
          }
          if (code_view.next) {
            let ls = this.__find_last_select(codes);
            if (ls) {
              ls.next = code_view.next;
              code_view.next.prev = ls;
            }
          }
        }

        for (let c of codes) c.parent = this;
        insertArrayAt(parent.codes, i, code_view.codes);
      }
    }
    // console.log(code_view.parent.infod);
  }

  mode_edit() {
    this.edit_key = this.header.display_val;
  }

  mode_rename() {
    if (this.is_property) {
      this.edit_key = this.header.display_key;
    }
  }

  get has_edit() {
    return this.edit_key != "";
  }

  get edit_text() {
    return this.value[this.edit_key];
  }

  set edit_text(val) {
    this.value[this.edit_key] = val;
  }

  get edit_id() {
    return this.id + "/" + this.edit_key;
  }

  add_before(before, code_view) {
    let prev = before.prev;

    before.prev = code_view;
    code_view.next = before;
    code_view.prev = prev;
    code_view.parent = this;

    if (prev) prev.next = code_view;

    this.codes.splice(this.codes.indexOf(before), 0, code_view);
    this.code_views.splice(this.code_views.indexOf(before), 0, code_view);
  }

  add_after(after, code_view) {
    let next = after.next;

    after.next = code_view;
    code_view.prev = after;
    code_view.next = next;
    code_view.parent = this;

    if (next) next.prev = code_view;

    this.codes.splice(this.codes.indexOf(after) + 1, 0, code_view);
    this.code_views.splice(this.code_views.indexOf(after) + 1, 0, code_view);
  }

  replace(new_val, old_val) {
    new_val.next = old_val.next;
    new_val.prev = old_val.prev;
    new_val.parent = this;

    if (new_val.next) {
      new_val.next.prev = new_val;
    }
    if (new_val.prev) {
      new_val.prev.next = new_val;
    }

    this.codes.splice(this.codes.indexOf(old_val), 1, new_val);
    this.code_views.splice(this.code_views.indexOf(old_val), 1, new_val);
  }

  add(code) {
    this._add(code);
    this.codes.push(code);
    return code;
  }

  add_prop(code) {
    this._add(code);
    this.props.push(code);
    return code;
  }

  _add(code) {
    code.parent = this;
    let c = this.last;
    if (c) {
      c.next = code;
      code.prev = c;
    }
    this.code_views.push(code);
  }

  allowed() {
    return this.code.allowed();
  }

  get model() {
    return this.code.model;
  }

  get is_property() {
    return this.type == VIEW_PROPERTY;
  }

  get is_last() {
    return this.next == undefined;
  }

  get has_header() {
    return this.header.is_visible;
  }

  get header() {
    return this.template.header;
  }

  get display_key() {
    return this.value[this.header.display_key];
  }

  get display_val() {
    return this.value[this.header.display_val];
  }

  header_property() {
    return this.template.property;
  }

  get has_footer() {
    return this.template.footer.is_visible;
  }

  get footer() {
    return this.template.footer;
  }

  get properties() {
    return this.template.properties;
  }

  get property() {
    return this.template.property;
  }

  get has_properties() {
    return this.properties.is_visible && this.code.has_properties;
  }

  get has_codes() {
    return this.code.has_codes;
  }

  get has_value() {
    return this.header.display_val != "";
  }

  get has_key() {
    return this.header.display_key != "";
  }

  get has_display_prefix() {
    return this.display_prefix != "";
  }

  get has_display_suffix() {
    return this.display_suffix != "";
  }

  get has_display_between() {
    return this.display_between != "";
  }

  get has_display_key() {
    return this.display_key != "";
  }

  get has_display_value() {
    return this.display_value != "";
  }

  get is_section() {
    return this.type == VIEW_SECTION;
  }

  /** line is simple element that doesn't contain any value only codes */
  get is_line() {
    return this.type == VIEW_LINE;
  }

  get is_block() {
    return this.type > 1;
  }

  get is_inline() {
    return this.type <= 1;
  }

  get code_class() {
    return view_class[this.type + 1];
  }

  get nearest_block() {
    if (this.is_block) {
      return this;
    }
    if (this.parent != undefined) {
      return this.parent.nearest_block;
    }
  }

  get nearest_select_block() {
    if (this.is_block && this.is_select) {
      return this;
    }
    if (this.parent != undefined) {
      return this.parent.nearest_select_block;
    }
  }

  get nearest_line() {
    if (this.is_line) {
      return this;
    }
    if (this.is_section) {
      for (let c of this.code_views) {
        if (c.is_line) return c;
      }
      return this;
    }
    if (this.parent != undefined) {
      return this.parent.nearest_line;
    }
  }

  first_line_select() {
    //if()
    if (this.is_section && this.is_select) return this;
    let line = this.nearest_line;
    let select = line.first_select(true);
    if (select == undefined) return line.parent.first_line_select();
    return select;
  }

  first_select(include_this = true) {
    if (this.is_select && include_this) return this;
    for (let c of this.code_views) {
      let ci = c.first_select();
      if (ci) return ci;
    }
    return undefined;
  }

  get last() {
    return this.code_views.length > 0
      ? this.code_views[this.code_views.length - 1]
      : undefined;
  }

  first() {
    return this.code_views.length > 0 ? this.code_views[0] : undefined;
  }

  last_select(include_children = true) {
    for (let i = this.code_views.length - 1; i >= 0; i -= 1) {
      let c = this.code_views[i];
      if (include_children) {
        let ci = c.last_select();
        if (ci != undefined) return ci;
      }

      if (c.is_select) return c;
    }
    if (this.is_select) return this;
    return undefined;
  }

  up_item() {
    let c = this.nearest_select_block;
    return c.prev_item();
  }

  down_item() {
    let c = this.nearest_select_block;
    return c.next_item();
  }

  next_item() {
    let c = this;
    let n = c.next;
    if (n != undefined) {
      while ((n != c) & !n.is_select) {
        c = n;
        n = c.next;
        if (n == undefined) break;
      }
    }

    if (n == undefined) {
      let p = c.parent;

      if (p == undefined) return c;
      return p.first_select(false);
    }
    return n;
  }

  prev_item() {
    let c = this;
    let n = c.prev;
    if (n != undefined) {
      while ((n != c) & !n.is_select) {
        c = n;
        n = c.prev;
        if (n == undefined) break;
      }
    }

    if (n == undefined) {
      let p = c.parent;

      if (p == undefined) return c;
      return p.last_select(false);
    }
    return n;
  }

  /* return CodeView and atom selected */
  next_select(include_children = true) {
    let c = this;
    if (include_children) {
      let cf = this.first_select(false);
      if (cf) return cf;
    }
    let p = c.parent;
    if (p == undefined) {
      return c.last_select(); //<- select last leaf that can be selected;
    }

    if (this.next) {
      //we cannot go to the next
      let ci = this.next.first_select();
      if (ci) return ci;
    }

    return p.next_select(false);
  }

  prev_line() {
    let c = this.nearest_block;
    let prev = c.prev_select();

    while ((prev != undefined) & (c != prev) & !prev.is_block) {
      c = prev;
      prev = c.prev_select();
    }
    return prev;
  }

  next_line() {
    let c = this;
    let next = this.next_select();

    while ((next != undefined) & (c != next) & !next.is_block) {
      c = next;
      next = c.next_select();
    }
    return next;
  }

  /* return CodeView and atom selected */
  prev_select() {
    let c = this;
    let p = c.parent;
    if (p == undefined) return c;

    // debugger;
    if (this.prev) {
      // if (this.prev.is_select) return this.prev;
      let ci = this.prev.last_select();

      if (ci) return ci;
    }

    if (!p.is_select) return p.prev_select();
    return p;
  }

  up_select() {
    if (this.parent == null) {
      return this;
    }
    return this.prev_line();
  }

  down_select() {
    if (this.parent == null) {
      return this.next_select(true);
    }

    let next = this.next_line(); //current line

    // console.log(next.edit_id, next);
    // let next = line.next_select(false);
    if (next != undefined) {
      return next;
    }
    let p = this.parent;
    if (p != undefined) {
      return p.next_select(false);
    }
    return p;
  }

  toJSON() {
    return [
      this.display,
      this.component_class,
      JSON.stringify(this.code_views)
    ];
  }

  get _json() {
    return this.toJSON();
  }

  get _json_code() {
    return this.code.toJSON();
  }

  get info() {
    return this.model.name + "/" + this.edit_text.substr(0, 10);
  }

  get infod() {
    let t = this.info;
    for (let cv of this.code_views) {
      t += "\n  " + cv.infod.replace("\n  ", "\n    ");
    }
    return t;
  }
}

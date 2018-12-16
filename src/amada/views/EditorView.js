import View from "../View";
import PartView from "./PartView";
import { source } from "common-tags";
import { TSThisType } from "babel-types";

function is_alphanum(key) {
  return key.key.length == 1;
}

// const re = /^[a-zA-Z0-9]$/;
/**
 * This is CodeViews with all information about current line
 * current position, current code and current section.
 *
 * which means that each code can have
 */
export default class EditorView extends View {
  get type() {
    return "editor";
  }

  constructor(
    amada,
    id,
    file,
    part_id = "" //<- current part for the view
  ) {
    super(amada, id, file.name, "view");
    // this.amada = amada;

    this.file = file;
    this.part_views = {};

    for (let p of file.parts) {
      this.part_views[p.name] = new PartView(this, p, file.schema.template); //<- default template for the schema
    }

    if (part_id != "") {
      this.set_part_view_id(part_id);
      // this.part_view = this.part_views[part_id];
    } else if (Object.keys(this.part_views).length > 0) {
      this.set_part_view_id(Object.keys(this.part_views)[0]);
    } else {
      this.part_view_id = "amada-preview";
      this.part_view = {};
    }

    this.__previous_mode = this.mode;
    this.code_preview = "";
    this.allowed_list = {};
    this.repeat_text = "";
  }

  /**
   * GLOBAL
   */
  get lang() {
    return this.schema.lang;
  }

  get schema() {
    return this.file.schema;
  }

  get part() {
    return this.part_view.part;
  }

  set_part_view_id(val) {
    this.part_view_id = val;
    this.part_view = this.part_views[val];
  }

  save() {
    this.file.save();
  }

  /**
   * MODE
   * @param {*} name
   * @param {*} mode_text
   */
  __mode_set(name, mode_text = "") {
    this.mode = name;
    this.mode_text = mode_text;
  }

  mode_set_edit(is_val = true, source_event = undefined) {
    let pv = this.part_view;
    if (!pv.edit_is_available) return;

    this.__mode_set("edit");
    pv.edit_on(is_val);
  }

  mode_set_view() {
    let pv = this.part_view;
    this.__mode_set("view");
    pv.edit_off();
  }

  get is_allowed() {
    return this.mode == "replace" || this.mode == "add";
  }

  mode_edit_code(code, pos = 0) {
    this.part_view.cursor_set(code, pos);
    this.mode_set_edit(true);
  }

  key(source_event) {
    let pv = this.part_view;
    if (this.mode == "edit") {
      if (is_alphanum(source_event)) {
        pv.edit_add(source_event.key);
      }
      switch (source_event.key) {
        case "Backspace":
          pv.edit_backspace();
          break;
        case "^d":
        case "Delete":
          pv.edit_delete();
          break;
        case "Enter":
          pv.edit_add("\n");
          break;
      }
    }
  }

  /**
   * ALLOWED FUNCTIONS
   * @param {*} ev
   */
  allowed_select(ev) {
    this.mode_set_view();
    this.allowed_function(ev);
  }

  allowed_set(list, allowed_function) {
    this.allowed_list = list; //pv.cursor.parent.allowed();
    this.allowed_function = allowed_function;

    let component = this.amada.components[this._component_id];
    if (component == undefined) return;

    component.set_allowed();
  }

  view_add_children() {
    let ev = this;
    let pv = this.part_view;
    if (!pv.cursor) return;

    if (pv.cursor.is_property) {
      return this.__view_property_insert(
        pv.cursor.code,
        pv.cursor.code.properties.indexOf(pv.cursor) + 1
      );
    }
    if (!pv.cursor.model.allowed) return;

    const func = function(model) {
      let c = model.create("_name_");
      ev.part.code_insert(c, ev.view_code);
      return ev.mode_edit_code(c);
    };
    this.view_code = pv.cursor;
    this.__mode_set("add", "children");
    this.allowed_set(pv.cursor.allowed(), func);
  }

  view_add_parent() {
    let ev = this;
    let pv = this.part_view;
    if (!pv.cursor) return;
    if (pv.cursor == pv.section) {
      return this.view_add_children();
    }
    if (pv.cursor.is_property) {
      return this.__view_property_insert(
        pv.cursor.code,
        pv.cursor.code.properties.indexOf(pv.cursor)
      );
    }
    if (!pv.cursor.parent.model.allowed) return;

    const func = function(model) {
      let c = model.create("_name_", [], [ev.view_code]);
      ev.part.code_replace(c, ev.view_code);
      return ev.mode_edit_code(c);
    };
    this.view_code = pv.cursor;
    this.__mode_set("add", "parent");
    this.allowed_set(pv.cursor.parent.allowed(), func);
  }

  __view_property_insert(code, i) {
    let prop_view = this.part.property_insert("name", "", code, i);
    return this.mode_edit_code(prop_view);
  }

  view_add_after() {
    let ev = this;
    let pv = this.part_view;
    if (!pv.cursor) return;
    if (pv.cursor == pv.section) {
      return this.view_add_children();
    }

    if (pv.cursor.is_property) {
      return this.__view_property_insert(
        pv.cursor.code,
        pv.cursor.code.properties.indexOf(pv.cursor) + 1
      );
    }
    if (!pv.cursor.parent.model.allowed) return;

    const func = function(model) {
      let c = model.create("_name_");
      let vc = ev.view_code;
      let i = vc.parent.codes.indexOf(vc);
      ev.part.code_insert(c, vc.parent, i + 1);
      return ev.mode_edit_code(c);
    };
    this.view_code = pv.cursor;
    this.__mode_set("add", "after");
    this.allowed_set(pv.cursor.parent.allowed(), func);
  }

  view_add_before() {
    let ev = this;
    let pv = this.part_view;
    if (!pv.cursor) return;
    if (pv.cursor == pv.section) {
      return this.view_add_children();
    }

    if (pv.cursor.is_property) {
      return this.__view_property_insert(
        pv.cursor.code,
        pv.cursor.code.properties.indexOf(pv.cursor)
      );
    }

    if (!pv.cursor.parent.model.allowed) return;

    const func = function(model) {
      let c = model.create("_name_");
      let vc = ev.view_code;
      let i = vc.parent.codes.indexOf(vc);
      ev.part.code_insert(c, vc.parent, i);
      return ev.mode_edit_code(c);
    };
    this.view_code = pv.cursor;
    this.__mode_set("add", "before");
    this.allowed_set(pv.cursor.parent.allowed(), func);
  }

  view_replace() {
    let pv = this.part_view;
    let ev = this;

    if (!pv.cursor) return;
    if (pv.cursor.is_property) {
      return this.mode_set_edit(false);
    }
    if (!pv.cursor.parent) return;
    if (!pv.cursor.parent.model.allowed) return;

    const func = function(model) {
      let rc = ev.view_code;
      ev.view_code = undefined;
      if (!rc) return;
      let c = ev.part.code_replace(model.convert(rc), rc);
      return ev.mode_edit_code(c);
    };
    this.__mode_set("replace");
    this.view_code = pv.cursor;
    this.allowed_set(pv.cursor.parent.allowed(), func);
  }

  view_delete(include_children = false) {
    let pv = this.part_view;
    if (!pv.cursor || pv.section == pv.cursor) return;

    let c = pv.cursor.next(!include_children, false);
    if (c == pv.cursor) c = pv.section;

    if (pv.cursor.is_property) {
      this.part.property_del(pv.cursor);
    } else {
      this.part.code_del(pv.cursor, include_children);
    }
    pv.cursor_set(c, 0);
  }

  /**
   * PREVIEW PART
   */
  preview() {
    this.part_view.preview_visible = !this.part_view.preview_visible;
    this.code_preview = this.file.preview();
  }

  preview_update() {
    this.code_preview = this.file.preview();
  }

  /**
   * CURSOR GO STRUCTURE
   */
  __go(par, func) {
    let pv = this.part_view;
    if (pv.cursor == undefined) return;

    if (this.repeat_text != "") {
      par = parseInt(this.repeat_text);
      this.repeat_text = "";
    }
    // console.log(func, this.part_view[func]);
    for (let i = 0; i < par; i++) func();
  }

  next(par = 1, source_event) {
    this.__go(par, () => this.part_view.cursor_next());
  }

  prev(par = 1, source_event) {
    this.__go(par, () => this.part_view.cursor_prev()); // parent_prev_select
  }

  down(par = 1, source_event) {
    this.__go(par, () => this.part_view.cursor_down()); //down select
  }

  up(par = 1, source_event) {
    this.__go(par, () => this.part_view.cursor_up()); //up select
  }

  next_item(par = 1, source_event) {
    this.__go(par, () => this.part_view.cursor_next_item());
  }

  prev_item(par = 1, source_event) {
    this.__go(par, () => this.part_view.cursor_prev_item());
  }

  down_item(par = 1, source_event) {
    this.__go(par, () => this.part_view.cursor_down_item());
  }

  up_item(par = 1, source_event) {
    this.__go(par, () => this.part_view.cursor_up_item());
  }

  /**Save repeat number */
  repeat(par = "1") {
    if (this.repeat_text != undefined) {
      this.repeat_text += par;
    } else {
      this.repeat_text = par;
    }
  }

  toJSON() {
    return [this.id, this.file, this.part_id];
  }

  info() {
    console.log(
      this.part_view.cursor.infod,
      this.part_view.cursor,
      this.part_view.template[this.part_view.cursor.view_id],
      {
        Parent:
          this.part_view.cursor.parent != undefined
            ? this.part_view.cursor.parent.info
            : "-"
      }
    );
  }
}

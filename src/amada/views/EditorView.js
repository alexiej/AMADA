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

  get lang() {
    return this.schema.lang;
  }

  get schema() {
    return this.file.schema;
  }

  save() {
    this.file.save();
  }

  set_part_view_id(val) {
    this.part_view_id = val;
    this.part_view = this.part_views[val];
  }

  __set_mode(name, mode_text = "") {
    this.mode = name;
    this.mode_text = mode_text;
  }

  set_mode_edit(par = true, source_event = undefined) {
    let pv = this.part_view;

    if (!pv.cursor_code.has_edit) return;

    this.__set_mode("edit");

    if (par) {
      pv.cursor_code.mode_edit();
    } else {
      pv.cursor_code.mode_rename();
    }
    pv.cursor_code_set(pv.cursor_code, 0);
  }

  set_mode_view() {
    let pv = this.part_view;
    if (pv.cursor_code) pv.cursor_code.mode_edit();
    this.__set_mode("view");
    pv.cursor_code_set(pv.cursor_code, 0);
  }

  get is_allowed() {
    return this.mode == "replace" || this.mode == "add";
  }

  allowed_select(ev) {
    this.set_mode_view();
    this.allowed_function(ev);
  }

  set_allowed(list, allowed_function) {
    this.allowed_list = list; //pv.cursor_code.parent.allowed();
    this.allowed_function = allowed_function;

    let component = this.amada.components[this._component_id];
    if (component == undefined) return;

    component.set_allowed();
  }

  edit(code_view, pos = 0) {
    this.part_view.cursor_code_set(code_view, 0);
    this.set_mode_edit(true);
  }

  /***
   * Depend on parameters
   * par: false, only delete parent and don't remove children.
   * Move children upper.
   */
  delete(par = false, source_event) {
    let pv = this.part_view;
    if (!pv.cursor_code || pv.cursor_code.parent == undefined) return;

    // let cc = !par ? pv.cursor_code.first_select(false) : undefined;

    let cc = pv.cursor_code.next_select_or_parent(!par);
    if (cc == pv.cursor_code || cc == undefined) cc = pv.cursor_code.parent;

    pv.delete(pv.cursor_code, par);
    pv.cursor_code_set(cc, 0);
  }

  add_children_function(model) {
    let code = model.create("_name");
    let cv = this.part_view.add_children(this.add_code, code);
    this.edit(cv);
  }

  add_children() {
    let pv = this.part_view;
    if (!pv.cursor_code) return;
    // if (!pv.cursor_code.parent) return;

    this.__set_mode("add", "children");
    this.add_code = pv.cursor_code;
    this.set_allowed(pv.cursor_code.allowed(), this.add_children_function);
  }

  add_parent_function(model) {
    let code = model.create("_name");
    let cv = this.part_view.replace(code, this.add_code, this.add_code.code);
    this.edit(cv);
  }

  add_parent() {
    let pv = this.part_view;

    if (!pv.cursor_code) return;
    if (!pv.cursor_code.parent) {
      return this.add_children();
    }

    this.__set_mode("add", "parent");
    this.add_code = pv.cursor_code;
    this.set_allowed(pv.cursor_code.parent.allowed(), this.add_parent_function);
  }

  add_after_function(model) {
    // model.create("_name_");
    // console.log(model.create("name"));

    let cv = this.part_view.add_after(this.add_code, model.create("_name_"));
    this.edit(cv);
  }

  add_before_function(model) {
    model.create("_name_");
    let cv = this.part_view.add_before(this.add_code, model.create("_name_"));
    this.edit(cv);
  }

  add_after() {
    let pv = this.part_view;
    if (!pv.cursor_code) return;
    if (!pv.cursor_code.parent) {
      return this.add_children();
    }

    if (pv.cursor_code.is_property) {
      let prop_view = pv.add_property(
        "name",
        "",
        pv.cursor_code.parent,
        pv.cursor_code.next
      );
      return this.edit(prop_view);
    }

    if (!pv.cursor_code.parent.model.allowed) return;

    this.__set_mode("add", "after");
    this.add_code = pv.cursor_code;
    this.set_allowed(pv.cursor_code.parent.allowed(), this.add_after_function);
  }

  add_before() {
    let pv = this.part_view;
    if (!pv.cursor_code) return;
    if (!pv.cursor_code.parent) {
      return this.add_children();
    }

    if (pv.cursor_code.is_property) {
      let prop_view = pv.add_property(
        "name",
        "v",
        pv.cursor_code.parent,
        pv.cursor_code
      );
      return this.edit(prop_view);
    }

    if (!pv.cursor_code.parent.model.allowed) return;
    this.__set_mode("add", "before");
    this.add_code = pv.cursor_code;
    this.set_allowed(pv.cursor_code.parent.allowed(), this.add_before_function);
  }

  replace_function(model) {
    let rc = this.rename_code;
    if (!rc) return;

    let cv = this.part_view.replace(model.convert(rc.code), rc);
    this.edit(cv);
  }

  replace() {
    let pv = this.part_view;

    if (!pv.cursor_code) return;
    if (!pv.cursor_code.parent) return;

    if (pv.cursor_code.is_property) {
      return this.set_mode_edit(false);
    }

    // console.log(object);

    if (!pv.cursor_code.parent.model.allowed) return;

    this.__set_mode("replace");
    this.rename_code = pv.cursor_code;

    this.set_allowed(pv.cursor_code.parent.allowed(), this.replace_function);
  }

  preview() {
    this.part_view.preview_visible = !this.part_view.preview_visible;
    this.code_preview = this.file.preview();
  }

  preview_update() {
    this.code_preview = this.file.preview();
  }

  key(source_event) {
    let pv = this.part_view;
    if (this.mode == "edit") {
      if (is_alphanum(source_event)) {
        pv.add_text(source_event.key);
      }
      switch (source_event.key) {
        case "Backspace":
          pv.back_text();
          break;
        case "^d":
        case "Delete":
          pv.del_text();
          break;
        case "Enter":
          pv.add_text("\n");
          break;
      }
    }
  }

  cursor_go(pos, source_event) {
    let pv = this.part_view;
    if (pv.cursor_code == undefined) return;
    pv.cursor_code_pos(pos);
  }

  cursor_up(par, source_event) {
    let pv = this.part_view;
    if (pv.cursor_code == undefined) return;
    pv.cursor_prev_line(pv.cursor_pos);
  }

  cursor_down(par, source_event) {
    let pv = this.part_view;
    if (pv.cursor_code == undefined) return;

    pv.cursor_next_line(pv.cursor_pos);
  }

  cursor_next(par, source_event) {
    let pv = this.part_view;
    if (pv.cursor_code == undefined) return;

    pv.cursor_code_pos(pv.cursor_pos + par);
  }

  cursor_prev(par, source_event) {
    let pv = this.part_view;
    if (pv.cursor_code == undefined) return;

    pv.cursor_code_pos(pv.cursor_pos - par);
  }

  cursor_last_in_line(par, source_event) {
    let pv = this.part_view;
    if (pv.cursor_code == undefined) return;

    pv.cursor_last_in_line(pv.cursor_pos);
    // return true;
  }

  cursor_first_in_line(par, source_event) {
    let pv = this.part_view;
    if (pv.cursor_code == undefined) return;

    pv.cursor_first_in_line(pv.cursor_pos);
  }

  __go(par, func) {
    let pv = this.part_view;
    if (pv.cursor_code == undefined) return;
    let code = pv.cursor_code;
    if (this.repeat_text != "") {
      par = parseInt(this.repeat_text);
      this.repeat_text = "";
    }
    for (let i = 0; i < par; i++) code = code[func](); // get_next(pv.cursor_code, par); //get first
    pv.cursor_code_set(code, 0);
  }

  next(par = 1, source_event) {
    this.__go(par, "next_select");
  }

  prev(par = 1, source_event) {
    this.__go(par, "parent_prev_select");
  }
  down(par = 1, source_event) {
    this.__go(par, "down_select");
  }

  up(par = 1, source_event) {
    this.__go(par, "up_select");
  }

  next_item(par = 1, source_event) {
    this.__go(par, "next_item");
  }

  prev_item(par = 1, source_event) {
    this.__go(par, "prev_item");
  }

  down_item(par = 1, source_event) {
    this.__go(par, "down_item");
  }

  up_item(par = 1, source_event) {
    this.__go(par, "up_item");
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
    console.log(this.part_view.cursor_code.infod, this.part_view.cursor_code);
  }
}

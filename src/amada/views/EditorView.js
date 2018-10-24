import View from "../View";
import PartView from "./PartView";
import { source } from "common-tags";
import { TSThisType } from "babel-types";
// import Part from "../../code/Part";

function is_alphanum(key) {
  // console.log(key.key.length, key.ctrlKey, key);
  return key.key.length == 1;
  // return key.is
}

//TODO: ONLY WORKS with +1, -1 parameters
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
  }

  get lang() {
    // console.log(this.schema);
    return this.schema.lang;
  }

  get schema() {
    return this.file.schema;
  }

  //
  save() {
    this.file.save();
    // console.log("A", this.file.preview());
  }

  set_part_view_id(val) {
    this.part_view_id = val;
    this.part_view = this.part_views[val];
  }

  set_mode_edit(source_event, amada, par = true) {
    let pv = this.part_view;

    if (!pv.cursor_code.has_edit) return;

    this.mode = "edit";

    if (par) {
      pv.cursor_code.mode_edit();
    } else {
      pv.cursor_code.mode_rename();
    }
    pv.cursor_code_set(amada, pv.cursor_code, 0);
  }

  set_mode_view() {
    let pv = this.part_view;
    if (pv.cursor_code) pv.cursor_code.mode_edit();
    pv.cursor_code_set(this.amada, pv.cursor_code, 0);
    this.mode = "view";
  }

  get is_allowed() {
    return this.mode == "rename" || this.mode == "add";
  }

  allowed_select(ev) {
    this.set_mode_view();
    this.allowed_function(ev);
  }

  set_allowed(list, allowed_function) {
    // let pv = this.part_view;

    this.allowed_list = list; //pv.cursor_code.parent.allowed();
    this.allowed_function = allowed_function;

    let component = this.amada.components[this._component_id];
    if (component == undefined) return;

    component.set_allowed();
  }

  edit(code_view, pos = 0) {
    this.part_view.cursor_code_set(this.amada, code_view, 0);
    this.set_mode_edit({}, this.amada, true);
  }

  delete(source_event, amada, par) {
    let pv = this.part_view;
    if (!pv.cursor_code) return;
    pv.delete(pv.cursor_code, par);
    this.next_item(undefined, amada, 1);
  }

  add_after_function(model) {
    model.create("_name_");
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
    if (!pv.cursor_code.parent) return;

    if (!pv.cursor_code.parent.model.allowed) return;

    this.mode = "add";
    this.add_code = pv.cursor_code;
    this.set_allowed(pv.cursor_code.parent.allowed(), this.add_after_function);
  }

  add_before() {
    let pv = this.part_view;
    if (!pv.cursor_code) return;
    if (!pv.cursor_code.parent) return;

    if (!pv.cursor_code.parent.model.allowed) return;
    this.mode = "add";
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
      return this.set_mode_edit(undefined, this.amada, false);
    }

    // console.log(object);

    if (!pv.cursor_code.parent.model.allowed) return;

    this.mode = "rename";
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

  set_mode(source_event, amada, par) {
    switch (par) {
      case "edit":
        this.set_mode_edit(source_event, amada, par);
        break;
      case "view":
        this.set_mode_view(source_event, amada, par);
        break;
      case "rename":
        this.set_mode_rename(source_event, amada, par);
        break;
    }
  }

  key(source_event, amada, par) {
    let pv = this.part_view;
    if (this.mode == "edit") {
      if (is_alphanum(source_event)) {
        pv.add_text(amada, source_event.key);
      }
      switch (source_event.key) {
        case "Backspace":
          pv.back_text(amada);
          break;
        case "^d":
        case "Delete":
          pv.del_text(amada);
          break;
        case "Enter":
          pv.add_text(amada, "\n");
          break;
      }
    }
  }

  cursor_go(source_event, amada, pos) {
    let pv = this.part_view;
    if (pv.cursor_code == undefined) return;
    pv.cursor_code_pos(amada, pos);
  }

  cursor_up(source_event, amada, par) {
    let pv = this.part_view;
    if (pv.cursor_code == undefined) return;
    pv.cursor_prev_line(amada, pv.cursor_pos);
  }

  cursor_down(source_event, amada, par) {
    let pv = this.part_view;
    if (pv.cursor_code == undefined) return;

    pv.cursor_next_line(amada, pv.cursor_pos);
  }

  cursor_next(source_event, amada, par) {
    let pv = this.part_view;
    if (pv.cursor_code == undefined) return;

    pv.cursor_code_pos(amada, pv.cursor_pos + par);
  }

  cursor_prev(source_event, amada, par) {
    let pv = this.part_view;
    if (pv.cursor_code == undefined) return;

    pv.cursor_code_pos(amada, pv.cursor_pos - par);
  }

  // rename(source_event, amada, par) {
  //   this.set_mode_rename();
  // }

  cursor_last_in_line(source_event, amada, par) {
    let pv = this.part_view;
    if (pv.cursor_code == undefined) return;

    pv.cursor_last_in_line(amada, pv.cursor_pos);
    // return true;
  }

  cursor_first_in_line(source_event, amada, par) {
    let pv = this.part_view;
    if (pv.cursor_code == undefined) return;

    pv.cursor_first_in_line(amada, pv.cursor_pos);
    // return true;
  }

  __go(amada, par, func) {
    let pv = this.part_view;
    if (pv.cursor_code == undefined) return;
    let code = pv.cursor_code;
    for (let i = 0; i < par; i++) code = code[func](); // get_next(pv.cursor_code, par); //get first
    pv.cursor_code_set(amada, code, 0);
  }

  next(source_event, amada, par) {
    this.__go(amada, par, "next_select");
  }

  prev(source_event, amada, par) {
    this.__go(amada, par, "prev_select");
  }
  down(source_event, amada, par) {
    this.__go(amada, par, "down_select");
  }

  up(source_event, amada, par) {
    this.__go(amada, par, "up_select");
  }

  next_item(source_event, amada, par) {
    this.__go(amada, par, "next_item");
  }

  prev_item(source_event, amada, par) {
    this.__go(amada, par, "prev_item");
  }

  down_item(source_event, amada, par) {
    this.__go(amada, par, "down_item");
  }

  up_item(source_event, amada, par) {
    this.__go(amada, par, "up_item");
  }

  toJSON() {
    return [this.id, this.file, this.part_id];
  }
}

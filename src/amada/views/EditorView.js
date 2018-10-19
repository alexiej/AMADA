import View from "../View";
import PartView from "./PartView";
import { source } from "common-tags";
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

    // if (val == "amada-preview") {
    //   this.__previous_mode = this.mode;
    //   this.set_mode_preview();
    // } else {
    //   this.set_mode_view();
    // }
  }

  // get part_view_id() {
  //   return this.part_view.name;
  // }

  // set part_view_id(val) {
  //   // console.log("Set ID to", val);

  // }

  set_mode_edit(source_event, amada, par) {
    this.editor();
    let pv = this.part_view;

    if (!pv.cursor_code.has_value) {
      this.rename();
      return;
    }
    this.mode = "edit";
    pv.cursor_code_set(amada, true, pv.cursor_code, pv.cursor_code.val_id, 0);
  }

  set_mode_view() {
    this.editor();
    this.mode = "view";
    // this.part_view.set_mode(par);
  }

  editor() {
    if (this.part_view_id == "amada-preview") {
      this.part_view_id = Object.keys(this.part_views)[0];
    }
  }

  preview() {
    this.part_view.preview_visible = !this.part_view.preview_visible;
    this.code_preview = this.file.preview();
  }

  preview_update() {
    this.code_preview = this.file.preview();
  }

  set_mode_preview() {
    // this.mode = "preview";
    // this.code_preview = this.file.preview();
  }

  set_mode(source_event, amada, par) {
    switch (par) {
      case "edit":
        this.set_mode_edit(source_event, amada, par);
        break;
      case "view":
        this.set_mode_view(source_event, amada, par);
        break;
    }
  }

  key(source_event, amada, par) {
    let pv = this.part_view;
    if (this.mode == "edit") {
      if (is_alphanum(source_event)) {
        pv.add_text(amada, source_event.key);
      }

      // console.log("key", source_event);
      switch (source_event.key) {
        case "Backspace":
          pv.back_text(amada);
          break;
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

  rename(source_event, amada, par) {
    console.log("rename");
  }

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

    pv.cursor_code_set(
      amada,
      code.has_value,
      code,
      code.has_value ? code.val_id : code.key_id,
      0
    );
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

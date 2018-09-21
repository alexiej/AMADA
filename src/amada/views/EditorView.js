import View from "../View";
import PartView from "./PartView";
import Part from "../../code/Part";

//TODO: ONLY WORKS with +1, -1 parameters

function get_nearest_next(code) {
  let parent = code.parent;
  let index = parent.codes.indexOf(code) + 1;

  if (index >= parent.codes.length) {
    return parent instanceof Part
      ? parent.code_lines[parent.code_lines.length - 1]
      : get_nearest_next(parent);
  } else {
    return parent.codes[index];
  }
}

function get_nearest_prev(code) {
  let index = code.parent.codes.indexOf(code) - 1;
  let parent = code.parent;
  if (index < 0) {
    return parent instanceof Part ? code : parent;
  } else {
    let c = parent.codes[index];
    while (c.codes.length > 0) {
      c = c.codes[c.codes.length - 1];
    }
    return c;
  }
}

function get_next(code, pos) {
  //next code in the insert
  let c = code;
  if (pos > 0) {
    for (let i = 0; i < pos; i++) {
      if (c.codes.length > 0) {
        c = c.codes[0];
      } else {
        c = get_nearest_next(c);
      }
    }
  } else {
    for (let i = pos; i < 0; i++) {
      c = get_nearest_prev(c);
    }
  }
  return c;
}

function get_down(code, pos) {
  let parent = code.parent;

  if (parent == undefined) return code;

  let index = parent.codes.indexOf(code);
  let ind = index + pos;

  if (ind < 0) {
    return parent instanceof Part ? code : parent;
    // we need to go to the first of the position
  }
  if (ind > parent.codes.length - 1) {
    // return get_next(parent, 1);
    if (code.codes.length > 0) {
      return code.codes[0];
    }
    return get_nearest_next(code);
    //we need to go to further parent
    // return get_next();
  }
  return parent.codes[ind];
}

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
    id,
    file,
    part_id = "" //<- current part for the view
  ) {
    super(id, file.name, "edit");

    this.file = file;
    this.part_views = {};

    for (let p of file.parts) {
      this.part_views[p.name] = new PartView(this, p);
    }

    if (part_id != "") {
      this.part_view = this.part_views[part_id];
    } else if (Object.keys(this.part_views).length > 0) {
      this.part_view = this.part_views[Object.keys(this.part_views)[0]];
    } else {
      this.part_view = {};
    }
  }

  get part_view_id() {
    return this.part_view.name;
  }

  set part_view_id(val) {
    this.part_view = this.part_views[val];
  }

  next(source_event, amada, par) {
    let pv = this.part_view;
    if (pv.cursor_code == undefined) return;
    let code = pv.cursor_code;
    for (let i = 0; i < par; i++) code = code.next(); // get_next(pv.cursor_code, par); //get first
    pv.cursor_code_set(amada, code);
  }

  prev(source_event, amada, par) {
    let pv = this.part_view;
    if (pv.cursor_code == undefined) return;

    let code = pv.cursor_code;
    for (let i = 0; i < par; i++) code = code.prev(); // get_next(pv.cursor_code, par); //get first
    pv.cursor_code_set(amada, code);
  }

  down(source_event, amada, par) {
    let pv = this.part_view;
    if (pv.cursor_code == undefined) return;

    let code = pv.cursor_code.down(par); // get_next(pv.cursor_code, par); //get first
    pv.cursor_code_set(amada, code);
  }

  up(source_event, amada, par) {
    let pv = this.part_view;
    if (pv.cursor_code == undefined) return;

    let code = pv.cursor_code.up(par); // get_next(pv.cursor_code, par); //get first
    pv.cursor_code_set(amada, code);
  }
}

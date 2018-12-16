export function __get_prev_line_pos(text, pos) {
  let v = text.lastIndexOf("\n", pos - 1) + 1;
  return v <= 1 ? 0 : v;
}

export function __get_next_line_pos(text, pos) {
  let v = text.indexOf("\n", pos);
  return v < 0 ? -1 : v + 1;
  // return f < 0 ? 0 : f;
}

export function __get_line_pos(text, pos) {
  let start_pos = __get_prev_line_pos(text, pos);
  return pos - (start_pos < 0 ? -1 : start_pos);
}

export function __get_cursor_line(text, pos) {
  let line = text.split("\n");
  var t = 0;
  var p = 0;
  for (let l of line) {
    // console.log("p", p + l.length, pos);
    if (p + l.length > pos) return t;
    p += l.length;
    t += 1;
  }
  return t;
}

export default class PartView {
  constructor(
    editor_view,
    part,
    template = undefined, //<- default list of views for the tempalte
    section_id = "", //<- current section
    code_id = "" //<-  current code in the section
  ) {
    this.editor_view = editor_view;
    this.id = this.get_id();
    this.part = part;
    this.template = template;

    this.section_id = section_id;
    this.code_id = code_id;
    // this.top = 0;

    this.counter = 0;
    this._component_id = -1;
    // this.code_view = this.part.section; // //this.get_view(this.part.section);

    // console.log(this.infod);
    // console.log(this.code_view.infod);
    // console.log(this.section);

    // let cc = this.codes.length > 0 ? this.codes[0] : undefined;
    // let cc = this.code_view; //this.code_view.next_select();
    this.cursor = this.section;
    this.cursor_pos = 0;

    this.edit_id = ""; //<-set
    this.edit_is_val = true; //<if we edit val or a key

    this.cursor_x = 0; //<current cursor line
    this.cursor_y = 0; //<current cursor position

    this.preview_visible = false;
  }

  /**
   * Global
   */
  get amada() {
    return this.editor_view.amada;
  }

  get_id() {
    return this.editor_view.amada.get_id();
  }

  get schema() {
    return this.part.schema;
  }

  get name() {
    return this.part.name;
  }

  get codes() {
    return this.part.section.codes;
  }

  get infod() {
    return "P/" + this.section.infod;
  }

  get section() {
    return this.part.section;
  }

  /**
   *
   * CURSOR
   */

  get cursor_view() {
    return this.template[this.cursor.view_id];
  }

  get cursor_text() {
    return this.edit_is_val ? this.cursor.val : this.cursor.key;
  }

  get cursor_key() {
    return (
      this.id +
      "/" +
      (this.edit_is_val ? this.cursor.val_id : this.cursor.key_id)
    );
  }

  set cursor_text(val) {
    if (this.edit_is_val) this.cursor.val = val;
    else this.cursor.key = val;
    this.code_change();
  }

  cursor_pos_set(pos = 0) {
    let t = this.cursor_text;
    // let p = this.cursor_pos;
    if (t == undefined) return;

    // console.log(this.cursor_text, !this.cursor_text);
    if (!t) pos = 0;
    else {
      pos = pos > t.length ? 0 : pos < 0 ? t.length : pos;
    }

    this.cursor_pos = pos;
    this.cursor_y = __get_cursor_line(t, pos);
    this.cursor_x = pos - __get_prev_line_pos(t, pos);

    let component = this.amada.components[this._component_id];
    if (component == undefined) return;
    component.cursor_to_code(
      this.cursor_key,
      this.cursor_text,
      this.cursor_pos
    );
  }

  cursor_set(code, pos = 0) {
    this.cursor = code;
    this.cursor_pos_set(pos);
  }

  /**
   * Global END
   */

  code_change() {
    if (this.preview_visible) {
      this.editor_view.preview_update();
    }
  }

  /**
   * Selection mode
   */
  cursor_prev() {
    this.cursor_set(this.cursor.prev());
  }

  cursor_next(include_children = true) {
    this.cursor_set(this.cursor.next(include_children));
  }

  cursor_up() {
    if (this.cursor.is_property) {
      return this.cursor_set(this.cursor.code);
    }

    let c = this.cursor.prev(true, false);
    let v = this.template[c.view_id];

    // console.log(this.cursor, c, v);

    while (c != undefined && !v.is_block) {
      c = c.prev(true, false);
      v = this.template[c.view_id];
    }

    return c ? this.cursor_set(c) : this.cursor_set(this.part.section);
  }

  cursor_down_item() {
    if (this.cursor.is_property) {
      // return this.cursor_set(this.cursor.code.next(true, false));
      let p = this.cursor.code;
      let i = p.properties.indexOf(this.cursor) + 1;
      if (i > p.properties.length - 1) return this.cursor_set(p.properties[0]);
      else return this.cursor_set(p.properties[i]);
    }
    let p = this.cursor.parent;
    if (p == undefined) return;
    let i = p.codes.indexOf(this.cursor) + 1;
    if (i > p.codes.length - 1) return this.cursor_set(p.codes[0]);
    else return this.cursor_set(p.codes[i]);
  }

  cursor_up_item() {
    if (this.cursor.is_property) {
      // return this.cursor_set(this.cursor.code.next(true, false));
      let p = this.cursor.code;
      let i = p.properties.indexOf(this.cursor) - 1;
      if (i < 0) return this.cursor_set(p.properties[p.properties.length - 1]);
      else return this.cursor_set(p.properties[i]);
    }
    let p = this.cursor.parent;
    if (p == undefined) return;
    let i = p.codes.indexOf(this.cursor) - 1;
    if (i < 0) return this.cursor_set(p.codes[p.codes.length - 1]);
    else return this.cursor_set(p.codes[i]);
  }

  cursor_next_item() {
    if (this.cursor.is_property) {
      // return this.cursor_set(this.cursor.code.next(true, false));
      let p = this.cursor.code;
      let i = p.properties.indexOf(this.cursor) + 1;
      if (i > p.properties.length - 1) return this.cursor_set(p.properties[0]);
      else return this.cursor_set(p.properties[i]);
    }
    return this.cursor_set(this.cursor.next(true, false));
  }

  cursor_prev_item() {
    if (this.cursor.is_property) {
      // return this.cursor_set(this.cursor.code.next(true, false));
      let p = this.cursor.code;
      let i = p.properties.indexOf(this.cursor) - 1;
      if (i < 0) return this.cursor_set(p.properties[p.properties.length - 1]);
      else return this.cursor_set(p.properties[i]);
    }
    if (this.cursor.parent == undefined) return;
    return this.cursor_set(this.cursor.parent);
  }

  cursor_down() {
    if (this.cursor.is_property) {
      return this.cursor_set(this.cursor.code.next(true, false));
    }
    let c = this.cursor;

    c = c.next(true, false);
    let v = this.template[c.view_id];
    while (c != undefined && !v.is_block) {
      c = c.next(true, false);
      v = this.template[c.view_id];
    }

    return c ? this.cursor_set(c) : this.cursor_set(this.part.section);
  }

  /***
   *
   * EDITOR MODE, EDIT TEXT
   */
  get edit_is_available() {
    // console.log(this.cursor, this.part.section);
    return this.cursor != this.part.section;
  }

  edit_on(is_val = true) {
    this.edit_is_val = is_val;
    this.edit_id = this.cursor_key;
    this.cursor_pos_set(0);
  }

  edit_off() {
    this.edit_id = undefined;
    this.edit_is_val = true;
  }

  edit_add(text) {
    let a = this.cursor_text;
    // console.log(a);
    let text2 = [
      a.slice(0, this.cursor_pos),
      text,
      a.slice(this.cursor_pos)
    ].join("");

    this.cursor_text = text2;
    this.cursor_pos_set(this.cursor_pos + 1);
    this.code_change();
  }

  edit_backspace() {
    let t = this.cursor_text;
    let p = this.cursor_pos;

    if ((p > 0) & (t.length > 0)) {
      this.cursor_text = t.slice(0, p - 1) + t.slice(p);
      this.cursor_pos_set(p - 1);
    }
    this.code_change();
  }

  edit_delete() {
    let t = this.cursor_text;
    let p = this.cursor_pos;

    if ((p < t.length) & (t.length > 0)) {
      this.cursor_text = t.slice(0, p) + t.slice(p + 1);
      this.cursor_pos_set(p);
    }
    this.code_change();
  }

  edit_next(par = 1) {
    this.cursor_pos_set(this.cursor_pos + par);
  }

  edit_prev(par = 1) {
    this.cursor_pos_set(this.cursor_pos - par);
  }

  edit_next_line() {
    let next_enter = __get_next_line_pos(this.cursor_text, this.cursor_pos);

    if (next_enter > 0) {
      let second_enter = __get_next_line_pos(this.cursor_text, next_enter);
      next_enter += this.cursor_x;

      next_enter =
        (second_enter > 0) & (next_enter >= second_enter)
          ? second_enter - 1
          : next_enter;

      next_enter =
        next_enter >= this.cursor_text.length
          ? this.cursor_text.length
          : next_enter;
      // console.log("k enter", next_enter, this.cursor_x, second_enter);
      this.cursor_pos_set(next_enter);
    } else {
      // pos = this.cursor_x;
      this.cursor_pos_set(this.cursor_x);
    }
  }

  edit_prev_line() {
    let curr_enter = __get_prev_line_pos(this.cursor_text, this.cursor_pos);
    let prev_enter = 0;

    if (curr_enter <= 0) {
      prev_enter = __get_prev_line_pos(
        this.cursor_text,
        this.cursor_text.length
      );
      curr_enter = this.cursor_text.length;
    } else {
      prev_enter = __get_prev_line_pos(this.cursor_text, curr_enter - 1);
    }

    if (prev_enter >= 0) {
      prev_enter += this.cursor_x;

      if (prev_enter >= curr_enter) {
        prev_enter = curr_enter - 1;
      }
      this.cursor_pos_set(prev_enter);
    }
  }

  edit_first_in_line() {
    let curr_enter = __get_prev_line_pos(this.cursor_text, this.cursor_pos);
    if (curr_enter >= 0) {
      this.cursor_pos_set(curr_enter);
    }
  }

  edit_last_in_line() {
    let curr_enter = __get_next_line_pos(this.cursor_text, this.cursor_pos);
    if (curr_enter > 0) {
      this.cursor_pos_set(curr_enter - 1);
    } else {
      this.cursor_pos_set(this.cursor_text.length);
    }
  }
}

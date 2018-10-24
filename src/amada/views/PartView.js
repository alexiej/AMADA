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
  // console.log("t", t);
  return t;
  // console.log(l);
}

export default class PartView {
  constructor(
    editor_view,
    part,
    template = undefined, //<- default list of views for the tempalte
    section_id = "", //<- current section
    code_id = "", //<-  current code in the section
    pos = 0 //<- position from the section
  ) {
    this.editor_view = editor_view;
    this.id = this.get_id();
    this.part = part;
    this.template = template;

    this.section_id = section_id;
    this.code_id = code_id;
    this.left = pos;
    this.top = 0;

    this.counter = 0;
    this._component_id = -1;
    this.code_view = this.get_view(this.part.section);

    // let cc = this.codes.length > 0 ? this.codes[0] : undefined;
    let cc = this.code_view.next_select();
    this.cursor_code = cc;
    this.cursor_pos = 0;
    this.cursor_x = 0; //<current cursor line
    this.cursor_y = 0; //<current cursor position

    this.preview_visible = false;
  }

  delete(code_view, include_children = false) {
    this.part.delete(code_view.code, include_children);
    code_view.parent.delete(code_view, include_children);
  }

  add_after(code_view, code) {
    let c = this.part.add_after(code_view.code, code);
    let cv = this.get_view(c);
    code_view.parent.add_after(code_view, cv);
    return cv;
  }

  add_before(code_view, code) {
    let c = this.part.add_before(code_view.code, code);
    let cv = this.get_view(c);
    code_view.parent.add_before(code_view, cv);
    return cv;
  }

  replace(new_code, replace_code_view) {
    this.part.replace(new_code, replace_code_view.code);
    let new_code_view = this.get_view(new_code);
    replace_code_view.parent.replace(new_code_view, replace_code_view);
    return new_code_view;
  }

  get cursor_text() {
    return this.cursor_code.edit_text;
  }

  set cursor_text(val) {
    this.cursor_code.edit_text = val;
    this.code_change();
  }

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

  code_change() {
    if (this.preview_visible) {
      this.editor_view.preview_update();
    }
  }

  add_text(amada, text) {
    let a = this.cursor_text;
    // console.log(a);
    let text2 = [
      a.slice(0, this.cursor_pos),
      text,
      a.slice(this.cursor_pos)
    ].join("");
    // console.log(text);

    this.cursor_text = text2;
    this.cursor_code_pos(amada, this.cursor_pos + 1);
    this.code_change();
  }

  back_text(amada) {
    let a = this.cursor_text;

    if ((this.cursor_pos > 0) & (a.length > 0)) {
      a = a.slice(0, this.cursor_pos - 1) + a.slice(this.cursor_pos);

      this.cursor_text = a;
      this.cursor_code_pos(amada, this.cursor_pos - 1);
    }
    this.code_change();
  }

  del_text(amada) {
    let a = this.cursor_text;

    if ((this.cursor_pos < this.cursor_text.length) & (a.length > 0)) {
      a = a.slice(0, this.cursor_pos) + a.slice(this.cursor_pos + 1);
      this.cursor_text = a;
      this.cursor_code_pos(amada, this.cursor_pos);
    }
    this.code_change();
  }

  cursor_next_line(amada, pos = 0) {
    let next_enter = __get_next_line_pos(this.cursor_text, pos);

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
      this.cursor_code_pos(amada, next_enter);
    } else {
      // pos = this.cursor_x;
      this.cursor_code_pos(amada, this.cursor_x);
    }
  }

  cursor_first_in_line(amada, par) {
    let curr_enter = __get_prev_line_pos(this.cursor_text, par);
    // console.log(curr_enter, par, "cursor_first_in_inline");

    if (curr_enter >= 0) {
      this.cursor_code_pos(amada, curr_enter);
    }
  }

  cursor_last_in_line(amada, par) {
    let curr_enter = __get_next_line_pos(this.cursor_text, par);
    if (curr_enter > 0) {
      this.cursor_code_pos(amada, curr_enter - 1);
    } else {
      this.cursor_code_pos(amada, this.cursor_text.length - 1);
    }
  }

  cursor_prev_line(amada, pos = 0) {
    let curr_enter = __get_prev_line_pos(this.cursor_text, pos);
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
      // console.log({ curr_enter, prev_enter, x: this.cursor_x });

      if (prev_enter >= curr_enter) {
        prev_enter = curr_enter - 1;
      }
      this.cursor_code_pos(this.amada, prev_enter);
    }
  }

  cursor_code_pos(amada, pos = 0) {
    if (!this.cursor_text) return;
    else {
      pos =
        pos > this.cursor_text.length
          ? 0
          : pos < 0
            ? this.cursor_text.length
            : pos;
    }

    this.cursor_pos = pos;
    this.cursor_y = __get_cursor_line(this.cursor_text, this.cursor_pos);
    this.cursor_x =
      this.cursor_pos - __get_prev_line_pos(this.cursor_text, this.cursor_pos);

    console.log({ pos, x: this.cursor_x, y: this.cursor_y });

    let component = this.amada.components[this._component_id];
    if (component == undefined) return;
    component.cursor_to_code(this.cursor_code, this.cursor_pos);
  }

  cursor_code_set(amada, code, pos = 0) {
    this.cursor_code = code;

    this.cursor_code_pos(amada, pos);
  }

  cursor_update(amada) {
    let component = amada.components[this._component_id];

    if (component == undefined) return;
    component.scroll_top();
  }

  get_view(code) {
    if (code.view_id in this.template) {
      let view = this.template[code.view_id];
      let code_view = view.get_view(code, this);
      return code_view;
    } else {
      return undefined;
    }
  }
}

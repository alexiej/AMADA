export default class PartView {
  constructor(
    editor_view,
    part,
    section_id = "", //<- current section
    code_id = "", //<-  current code in the section
    pos = 0 //<- position from the section
  ) {
    this.editor_view = editor_view;
    this.part = part;

    this.section_id = section_id;
    this.code_id = code_id;
    this.left = pos;
    this.top = 0;

    this._component_id = -1;

    let cc = this.codes.length > 0 ? this.codes[0] : undefined;
    this.cursor_code = cc;
    this.cursor_line = cc;
    // this.cursor_line; //<-this is cursor line and it should affect the real position of the code
    // this.cursor_parent = this.part;
    // this.cursor_pos
    // this.cursor_code =
    //
  }

  get id() {
    return this._component_id;
  }

  get name() {
    return this.part.name;
  }

  get codes() {
    return this.part.section.codes;
  }

  get code_lines() {
    return this.part.code_lines;
  }

  cursor_line_set(amada, line) {
    let code = this.part.code_lines[line];

    this.top = code.line;
    this.cursor_line = code;
    this.cursor_code = code;

    this.cursor_update(amada);
  }

  cursor_code_set(amada, code) {
    // this.top = code.line;
    this.cursor_line = code.nearest_line;
    this.cursor_code = code;

    let component = amada.components[this._component_id];
    if (component == undefined) return;
    component.cursor_to_code(code);

    //
    //
    // this.cursor_update(amada, code);
  }

  cursor_update(amada) {
    let component = amada.components[this._component_id];

    if (component == undefined) return;
    component.scroll_top();
  }
}

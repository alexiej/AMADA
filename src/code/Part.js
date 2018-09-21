export default class Part {
  /**
   * get schema of the code
   * @param {*} id
   * @param {*} name
   * @param {*} schema
   * @param {*} codes
   */
  constructor(id, name, schema, codes = []) {
    this.id = id;
    this.name = name;
    this.schema = schema;

    this.counter = 1;
    //<-we've got one section
    this.code_lines = [];

    this.section = schema.models["section-part"].create(this.name);
    this.section.id = 0;

    this.add_codes(codes); //<-add codes to the section that has no lines before and after
  }

  /**
   * Add codes to the end of the line, and update lines
   * for the rest of the codes.
   * Code can have header or footer
   **/
  // add(codes = []) {
  //   for (let c of codes) {
  //     c.parent = this.code;
  //   }
  // }

  //create new code, with selected model

  add_codes(codes) {
    this.__add_codes(undefined, codes);
    this.section.codes.push(...codes);
  }
  __add_codes(parent, codes) {
    for (let c of codes) {
      this.__add(parent, c);
    }
  }

  add(code) {
    this.__add(undefined, code);
    this.section.codes.push(code);
  }

  __add(parent, code) {
    code.part = this;
    code.parent = parent;
    code.id = this.counter;
    this.counter += 1;

    if (code.is_line) {
      code.line = this.code_lines.length;
      this.code_lines.push(code);
    }

    this.__add_codes(code, code.headers);
    this.__add_codes(code, code.codes);
    this.__add_codes(code, code.footers);
  }

  // codes_assign(codes) {
  //   this.codes = codes;

  //   for (let c of codes) {
  //     c.parent = this;
  //   }
  //   this.code_lines = []; //this is a version of the code to load
  //   this.get_lines(this.codes);
  // }

  // get_lines(codes, line = 0) {
  //   for (let c of codes) {
  //     c.id = this.id + "/" + "c" + this.counter;
  //     this.counter += 1;

  //     if (c.is_line) {
  //       c.line = line;
  //       line += 1;
  //       this.code_lines.push(c);
  //     }
  //     if (c.codes.length > 0) {
  //       line = this.get_lines(c.codes, line);
  //     }
  //   }
  //   return line;
  // }
}

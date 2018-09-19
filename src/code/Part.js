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

    this.counter = 0;
    //<-we've got one section
    this.code_lines = [];
    this.section = schema.models.section.create(this.name);

    this.__add_lines();

    // this.add(this.section);
    // this.insert(this.section);
    // console.log(this);
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
  add(codes) {
    for (let c of codes) {
      c.parent = this.code;
      if (c.headers.length > 0) {
      }
    }
  }

  codes_assign(codes) {
    this.codes = codes;

    for (let c of codes) {
      c.parent = this;
    }
    this.code_lines = []; //this is a version of the code to load
    this.get_lines(this.codes);

    // console.log(this.code_lines);
  }

  get_lines(codes, line = 0) {
    for (let c of codes) {
      c.id = this.id + "/" + "c" + this.counter;
      this.counter += 1;

      if (c.is_line) {
        c.line = line;
        line += 1;
        this.code_lines.push(c);
      }
      if (c.codes.length > 0) {
        line = this.get_lines(c.codes, line);
      }
    }
    return line;
  }
}

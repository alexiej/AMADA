export default class Part {
  /**
   * get schema of the code
   * @param {*} id
   * @param {*} name
   * @param {*} schema
   * @param {*} codes
   */
  constructor(file, id, name, schema, codes = []) {
    this.file = file;
    this.id = id;
    this.name = name;
    this.schema = schema;

    this.counter = 1;
    //<-we've got one section
    this.code_lines = [];

    this.section = schema.models["section-part"].create(this.name, this.name);
    this.section.id = 0;
    this.section.part = this;

    this.add_codes(codes); //<-add codes to the section that has no lines before and after
  }

  //create new code, with selected model
  add_codes(codes) {
    this.__add_codes(this.section, codes);
    this.section.codes.push(...codes);
  }
  __add_codes(parent, codes) {
    for (let c of codes) {
      this.__add(parent, c);
    }
  }

  add(code) {
    this.__add(this.section, code);
    this.section.codes.push(code);
  }

  __add(parent, code) {
    this.counter += 1;

    code.part = this;
    code.parent = parent;
    code.id = this.counter;
    this.__add_codes(code, code.codes);
  }
}

import { insertArrayAt } from "./__helpers";

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

    this.counter = 0;
    this.code_lines = [];

    this.section = schema.models["section-part"].create(this.name);
    this.section.id = 0;
    this.section.part = this;

    this.codes_add(codes); //<-add codes to the section that has no lines before and after
  }

  __get_counter() {
    this.counter += 1;
    return this.counter;
  }

  __codes_add(parent, codes) {
    for (let c of codes) {
      this.__code_add(parent, c);
    }
  }

  __code_add(parent, code) {
    code.parent = parent;
    if (code.part == this) {
      for (let p of code.properties) {
        p.code = code;
      }
      return; // we don't need to add code when it is there
    }

    code.part = this;
    code.id = this.__get_counter();

    for (let p of code.properties) {
      p.code = code;
      p.id = this.__get_counter();
    }

    this.__codes_add(code, code.codes);
  }

  property_del(property) {
    let i = property.code.properties.indexOf(property);
    property.code.properties.splice(i, 1);
  }

  property_insert(key, value, code, i = -1) {
    let p = code.model.property(key, value);
    p.code = code;
    p.id = this.__get_counter();

    if (i < 0) {
      code.properties.push(p);
    } else {
      code.properties.splice(i, 0, p);
    }
    return p;
  }

  //create new code, with selected model
  codes_add(codes) {
    this.__codes_add(this.section, codes);
    this.section.codes.push(...codes);
  }

  code_add(code) {
    this.__code_add(this.section, code);
    this.section.codes.push(code);
  }

  code_replace(new_code, replace_code) {
    let parent = replace_code.parent;
    this.__code_add(parent, new_code);
    parent.codes.splice(parent.codes.indexOf(replace_code), 1, new_code);
    return new_code;
  }

  code_insert(code, parent, i = -1) {
    this.__code_add(parent, code);
    if (i < 0) parent.codes.push(code);
    else parent.codes.splice(i, 0, code);
    return code;
  }

  add_children(parent, code) {
    this.__code_add(parent, code);
    parent.codes.push(code);
    return code;
  }

  code_del(code, include_children = false) {
    let parent = code.parent;
    let i = parent.codes.indexOf(code);
    if (!include_children) {
      let codes = code.codes;
      for (let c of codes) c.parent = parent;
      insertArrayAt(parent.codes, i + 1, code.codes);
    }
    parent.codes.splice(i, 1);
  }
}

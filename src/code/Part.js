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

    this.counter = 1;
    //<-we've got one section
    this.code_lines = [];

    this.section = schema.models["section-part"].create(this.name);
    this.section.id = 0;
    this.section.part = this;

    this.add_codes(codes); //<-add codes to the section that has no lines before and after
  }

  delete(code, include_children = false) {
    let parent = code.parent;
    let i = parent.codes.indexOf(code);
    if (!include_children) {
      let codes = code.codes;
      for (let c of codes) c.parent = parent;
      insertArrayAt(parent.codes, i + 1, code.codes);
    }
    parent.codes.splice(i, 1);
  }

  delete_property(code, property) {
    let i = code.properties.indexOf(property);
    code.properties.splice(i, 1);
  }

  add_property(key, value, code, before = undefined) {
    let p = {
      key: key,
      value: value
    };
    if (before == undefined) {
      code.properties.push(p);
    } else {
      let i = code.properties.indexOf(before);
      code.properties.splice(i, 0, p);
    }
    return p;
  }

  //create new code, with selected model
  add_codes(codes) {
    this.__add_codes(this.section, codes);
    this.section.codes.push(...codes);
  }

  add(code) {
    this.__add(this.section, code);
    this.section.codes.push(code);
  }

  __add_codes(parent, codes) {
    for (let c of codes) {
      this.__add(parent, c);
    }
  }

  add_children(parent, code) {
    this.__add(parent, code);
    parent.codes.push(code);
    return code;
  }

  __add(parent, code) {
    if (code.part == this) return; // we don't need to add code when it is there

    this.counter += 1;

    code.part = this;
    code.parent = parent;
    code.id = this.counter;
    this.__add_codes(code, code.codes);
  }

  replace(new_code, replace_code) {
    let parent = replace_code.parent;
    this.__add(parent, new_code);
    parent.codes.splice(parent.codes.indexOf(replace_code), 1, new_code);
    return new_code;
  }

  add_after(after, code) {
    if (!after.parent == null) return; //<- we cannot add after section part
    this.__add(after.parent, code);
    let p = after.parent;
    let i = p.codes.indexOf(after);
    p.codes.splice(i + 1, 0, code);
    return code;
  }

  add_before(after, code) {
    if (!after.parent == null) return; //<- we cannot add after section part
    this.__add(after.parent, code);
    let p = after.parent;
    let i = p.codes.indexOf(after);
    p.codes.splice(i, 0, code);
    return code;
  }
}

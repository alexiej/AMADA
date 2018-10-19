// import { CODE_HEADER, CODE_CODES, CODE_FOOTER } from "./Model";

export default class Code {
  constructor(
    model,
    key = "", //<-id of the code
    value = "", //<-value of the cod
    properties = [],
    codes = []
    // headers = [],
    // footers = []
  ) {
    this.parent = undefined;
    this.part = undefined; //<- we need to have connection to the part

    this.model = model;
    this.id = -1; //need to be identified in Part
    this.line = 0;
    this.properties = properties; //<-properties of the codes, properties can be visible inside code section
    this.key = key;
    this.value = value; //<-sometimes when we need add name to the section
    this.codes = codes; //<- list of codes assign to the code
  }

  get has_properties() {
    return this.properties.length > 0;
  }

  get has_codes() {
    return this.codes.length > 0;
  }

  get has_value() {
    return this.model.has_value;
  }

  /**
   * Standard operation to get the left/right/up and down code
   */
  next(include_children = true) {
    let c = this;
    if (c.has_codes && include_children) {
      return c.codes[0];
    }

    let p = c.parent;
    if (p == undefined) {
      return c.last();
    }
    let ind = p.codes.indexOf(c) + 1;
    if (ind >= p.codes.length) {
      return p.next(false);
    } else {
      return p.codes[ind];
    }
  }

  prev() {
    let c = this;
    let p = c.parent;
    if (p == undefined) return c;

    let ind = p.codes.indexOf(c) - 1;
    if (ind < 0) {
      return p;
    } else {
      return p.codes[ind].last();
    }
  }

  last() {
    if (this.has_codes) {
      return this.codes[this.codes.length - 1].last();
    }
    return this;
  }

  up() {
    let code = this.nearest_line;
    let parent = code.parent;
    if (parent == undefined) return code;

    let ind = parent.codes.indexOf(code) - 1;
    if (ind <= 0) {
      return parent.codes[0];
    } else {
      return parent.codes[ind];
    }
  }

  down() {
    let code = this.nearest_line;

    let parent = code.parent;
    if (parent == undefined) return code;

    let ind = parent.codes.indexOf(code) + 1;
    if (ind >= parent.codes.length) {
      return parent.codes[parent.codes.length - 1];
    } else {
      return parent.codes[ind];
    }
  }

  get nearest_line() {
    var c = this;
    while (!c.is_line && !c.is_section) {
      c = c.parent;
    }
    return c;
  }

  get is_line() {
    return this.model.is_line;
  }

  get is_inline() {
    return this.model.is_inline;
  }

  get is_section() {
    return this.model.is_section;
  }

  get is_group() {
    // can contain inline model or line models
    return this.model.is_group;
  }

  /**
   * Get view of the model
   */
  get view_id() {
    return this.model.view_id;
  }

  toJSON() {
    return [
      this.model.id,
      this.id,
      this.value,
      this.properties.length > 0 ? this.properties : "",
      this.codes.length > 0 ? this.codes : ""
    ];
  }

  get _json() {
    return this.toJSON();
  }

  preview(generator_id = "amada") {
    // this.model.get
    return this.model.preview(this, generator_id);
  }

  // /**
  //  * Get lines
  //  * @param {line number} line number
  //  */
  // get_lines(line = 0) {

  // }

  // codes_assign(codes) {
  //   this.codes = codes;
  //   for (let c of codes) {
  //     c.parent = this;
  //   }
  // }
}

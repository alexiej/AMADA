export default class Code {
  constructor(
    model,
    value = "",
    properties = [],
    codes = [],
    headers = [],
    footers = []
  ) {
    this.model = model;
    this.id = -1; //need to be identified in Part
    this.line = 0;
    this.properties = properties; //<-properties of the codes, properties can be visible inside code section
    this.value = value; //<-sometimes when we need add name to the section

    //code header and footer
    this.headers = headers; //<- list of headers of the code
    this.codes = codes; //<- list of codes assign to the code
    this.footers = footers; //<- list of foooters of the code
  }

  get has_codes() {
    return this.codes.length > 0;
  }

  get has_header() {
    return this.headers.length > 0;
  }

  get has_footers() {
    return this.footers.length > 0;
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

  up(par = 1) {
    let ind = this.line - par;
    let part = this.part;
    if (ind < 0) {
      return part.code_lines[0];
    } else {
      return part.code_lines[ind];
    }
  }

  down(par = 1) {
    let ind = this.line + par;
    let part = this.part;
    if (ind >= part.code_lines.length) {
      return part.code_lines[part.code_lines.length - 1];
    } else {
      return part.code_lines[ind];
    }
    // let c = this;
    // let p = c.parent;
    // if (p == undefined) return c;
    // let ind = p.codes.indexOf(c) + 1;
  }
  // length() {
  //   //length of the code
  //   return 0;
  // }

  /**
   * Add to the end of the codes
   *
   * We can assign new code, and set for them a parent
   * We need to add codes from the part system to know
   * if everything goes allright
   */
  // add(codes = []) {
  //   for(let c of codes) {
  //     this.codes.push(c);
  //   }
  // }

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

  get header_class() {
    return this.model.header_class;
  }

  get codes_class() {
    return this.model.codes_class;
  }

  get footer_class() {
    return this.model.footer_class;
  }

  get item_class() {
    return this.model.item_class;
  }

  toJSON() {
    return {
      model_id: this.model.id,
      id: this.id,
      value: this.value,
      properties: this.properties,
      header: this.header,
      codes: this.codes,
      footer: this.footer
    };
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

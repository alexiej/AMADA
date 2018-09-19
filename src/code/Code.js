export default class Code {
  constructor(
    model,
    value = "",
    properties = [],
    headers = [],
    footers = [],
    codes = []
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

  get_nearest_line() {
    var c = this;
    while (!c.is_line) {
      c = c.parent;
    }
    return c;
  }

  get is_line() {
    return this.model.is_line;
  }

  get is_group() {
    // can contain inline model or line models
    return this.model.is_group;
  }

  /**
   * Get lines
   * @param {line number} line number
   */
  get_lines(line = 0) {}

  // codes_assign(codes) {
  //   this.codes = codes;
  //   for (let c of codes) {
  //     c.parent = this;
  //   }
  // }
}

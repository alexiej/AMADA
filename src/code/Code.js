// import { CODE_HEADER, CODE_CODES, CODE_FOOTER } from "./Model";
import { filterByKeys } from "./__helpers";

export default class Code {
  constructor(
    model,
    value = "", //<-value of the cod
    properties = [],
    codes = []
  ) {
    this.parent = undefined;
    this.part = undefined; //<- we need to have connection to the part

    this.model = model;
    this.id = -1; //need to be identified in Part
    this.line = 0;
    this.properties = properties; //<-properties of the codes, properties can be visible inside code section
    this.value = value; //<- Value of the code
    this.codes = codes; //<- list of codes assign to the code
  }

  add(code) {
    code.parent = this;
    this.codes.push(code);
    return;
  }

  get has_properties() {
    return this.properties.length > 0;
  }

  get has_value() {
    return this.value != "";
  }

  get has_codes() {
    return this.codes.length > 0;
  }

  get schema() {
    return this.model.schema;
  }

  allowed() {
    return filterByKeys(this.schema.models, this.model.allowed(this));
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

  preview(generator_id) {
    return this.model.preview(
      this,
      generator_id ? generator_id : this.schema.preview_default
    );
  }

  get info() {
    let p_text = "";
    if (this.has_properties) {
      p_text = " (";
      for (let p of this.properties) {
        p_text += p.key + ":" + p.value + ",";
      }
      p_text += ")";
    }

    return this.model.name + p_text + "/" + this.id;
  }

  get infod() {
    let t = this.info;
    for (let cv of this.codes) {
      t += "\n  " + cv.infod.replace("\n  ", "\n    ");
    }
    return t;
  }
}

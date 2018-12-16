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

  //real key value
  get key() {
    return this.model.name;
  }

  set key(v) {
    this.model.name = v;
  }

  get key_id() {
    return this.id + "/key";
  }

  //real val value
  get val() {
    return this.value;
  }

  set val(v) {
    this.value = v;
  }

  get val_id() {
    return this.id + "/val";
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

  ///<--------------SIMULATION
  next(include_children = true, include_properties = true) {
    if (include_properties && this.has_properties) {
      return this.properties[0];
    }
    if (include_children && this.has_codes) {
      return this.codes[0];
    }

    let p = this.parent;
    if (p == undefined) {
      if (!include_children) {
        let last = this.last();
        let section_last = this.part.section.last();

        if (last == section_last) {
          return this.part.section;
        }
        return section_last;
      }

      // if(last==)
      return this.part.section.last();
    }

    let i = p.codes.indexOf(this);
    if (i + 1 < p.codes.length) return p.codes[i + 1];

    return p.next(false, false);
  }

  prev(includes_codes = true, include_properties = true) {
    let p = this.parent;
    if (p == undefined) return this.part.section;
    // console.log("prev");

    let i = p.codes.indexOf(this) - 1;
    if (i >= 0) {
      return p.codes[i].last(include_properties);
    }
    if (include_properties && p.has_properties) {
      return p.properties[p.properties.length - 1];
    }

    return p;
  }

  last(include_properties = true) {
    if (this.has_codes) {
      return this.codes[this.codes.length - 1].last(include_properties);
    }
    if (include_properties && this.has_properties) {
      return this.properties[this.properties.length - 1];
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
        p_text += p.info + ",";
      }
      p_text += ")";
    }

    return (
      this.model.name + ":" + this.val.substr(0, 10) + p_text + "/" + this.id
    );
  }

  get infod() {
    let t = this.info;
    for (let cv of this.codes) {
      t += "\n  " + cv.infod.replace("\n  ", "\n    ");
    }
    return t;
  }
}

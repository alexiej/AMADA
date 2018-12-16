import { filterByKeys } from "./__helpers";

export default class Property {
  constructor(
    key = "",
    value = "" //<-value of the property
  ) {
    this.id = -1;
    this.code = undefined;
    this.key = key;
    this.value = value;
  }

  get parent() {
    return this.code;
  }

  get is_property() {
    return true;
  }

  next(include_children = true) {
    let p = this.code;
    let i = p.properties.indexOf(this) + 1;
    if (i < p.properties.length) return p.properties[i];

    return p.next(include_children, false);
  }

  prev() {
    let p = this.code;
    let i = p.properties.indexOf(this) - 1;
    if (i >= 0) return p.properties[i];

    return p;
  }

  get val() {
    return this.value;
  }

  set val(v) {
    this.value = v;
  }

  get key_id() {
    return this.id + "/key";
  }

  get val_id() {
    return this.id + "/val";
  }

  get infod() {
    return this.info;
  }

  get info() {
    return this.key + "='" + this.value + "'/" + this.id;
  }
}

import { filterByKeys } from "./__helpers";

export default class Property {
  constructor(
    key = "",
    value = "" //<-value of the property
  ) {
    this.key = key;
    this.value = value;
  }

  get info() {
    return this.key + "='" + this.value + "'";
  }
}

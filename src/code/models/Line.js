import Model from "../Model.js";

export default class Line extends Model {
  constructor(
    schema = undefined,
    id = "line",
    name = "line",
    component_name = "amada-line"
  ) {
    super(schema, id, name, component_name);
  }

  get is_line() {
    return true;
  }

  get is_group() {
    // can be
    return false;
  }
}

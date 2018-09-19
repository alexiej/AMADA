import Model from "../Model.js";

export default class Properties extends Model {
  constructor(
    schema = undefined,
    id = "properties",
    name = "properties",
    component_name = "amada-inline"
  ) {
    super(schema, id, name, component_name);
  }

  get is_line() {
    //is line means that code contain only inline models
    return false;
  }

  // get component_name() {
  //   return "amada-inline";
  // }

  get is_group() {
    return true;
  }
}

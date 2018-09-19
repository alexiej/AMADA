import Model from "../Model.js";
import Code from "../Code";

export default class Section extends Model {
  constructor(
    schema = undefined,
    id = "section",
    name = "section",
    component_name = "amada-section"
  ) {
    super(schema, id, name, component_name);
  }

  create(value = "", properties = [], headers = [], codes = [], footers = []) {
    // properties = properties;
    headers = [this.schema.line.create(value), ...headers];
    footers = [...footers, this.schema.line.create(value)];
    // this.codes = codes;
    return new Code(this, value, properties, headers, footers, codes);
  }

  get is_line() {
    return true;
  }

  get is_group() {
    return true;
  }

  // down(code, part_view, source_event, amada, action) {
  //   //par means how much up and down
  //   // var pos = part_view.top + action.par;
  //   part_view.cursor_next(action.par);

  //   // part_view.
  //   // part_view.top = pos < 0 ? 0 : pos > 38 ? 38 : pos;
  //   // part_view.cursor_update(amada);
  // }
}

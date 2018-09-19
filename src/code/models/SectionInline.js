import Model from "../Model.js";

export default class SectionInline extends Model {
  constructor(
    schema = undefined,
    id = "section-inline",
    name = "section-inline",
    component_name = "amada-inline"
  ) {
    super(schema, id, name, component_name);
  }

  get is_line() {
    return false;
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

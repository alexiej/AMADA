export default class View {
  constructor(amada, id, name, mode = "") {
    this.amada = amada;
    this.id = id;
    this.name = name;
    this.mode = mode;
    this.__component_id = -1;
  }

  /**
   * Check if mode starts with the 'name'
   * @param {view} view view name
   * @param {name} mode mode name
   */
  mode_is(name) {
    return this.mode.startsWith(name);
  }

  key(source_event, amada, par) {}

  run(source_event, amada, action) {}

  get type() {
    return "";
  }
}

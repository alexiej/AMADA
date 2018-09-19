/**
 * This is an interpreter of the file. This can load or not load the file and return
 * correct file object with all data, based on the defintion inside. interpreter can have
 * converter for the file or object. each interpreter can work with the file or
 * with the object.
 */
// import SchemaDefault from "./schemas/default.js";
// import SchemaMock from "./schemas/mock.js";
// import SchemaCode from "./SchemaCode";

export default class Schema {
  constructor(id, name, models = []) {
    this.id = id;
    this.name = name;
    this.models = {};
    this.add(models);
  }

  add(models = []) {
    for (let m of models) {
      m.schema = this;
      this.models[m.id] = m;
    }
  }

  get preview() {
    //return html code of the file
  }

  //get output of the code
  output(file) {
    return "";
  }

  parts_decode(file) {
    return {};
  }
}

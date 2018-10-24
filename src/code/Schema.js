/**
 * This is an interpreter of the file. This can load or not load the file and return
 * correct file object with all data, based on the defintion inside. interpreter can have
 * converter for the file or object. each interpreter can work with the file or
 * with the object.
 */

export default class Schema {
  constructor(id, name, models = {}, templates = {}, generators = {}) {
    this.id = id;
    this.name = name;
    this.models = models;

    this.template = templates[Object.keys(templates)[0]];
    this.templates = templates;
    this.generators = generators;

    this.add_models(models);
    for (let k in templates) {
      for (let tk in templates[k]) {
        templates[k][tk].schema = this;
      }
    }
  }

  get lang() {
    return this.id;
  }

  add_templates() {}

  add_models(models = {}) {
    for (let k in models) {
      let m = models[k];
      m.schema = this;
      this.models[m.id] = m;
    }
  }

  preview(generator_id = "amada") {}

  parts_decode(file) {
    return {};
  }
}

import Code from "./Code";
// import ModelCreator from "./ModelCreator";

const create_const = (model, value, properties, codes) => {
  let headers = [];
  for (let m of model.headers) {
    headers.push(m.create(m, value));
  }
  let footers = [];
  for (let m of model.footers) {
    footers.push(m.create(m, value));
  }
  return new Code(model, value, properties, headers, codes, footers);
};

/**
 * usually schema for the model is undefined
 */
export default class Model {
  constructor(
    id,
    name,
    component_class = "",
    component_name,
    is_line = true,
    is_group = true,
    is_visible = true,
    properties = [],
    headers = [],
    footers = [],
    create_function = undefined
  ) {
    this.id = id;
    this.name = name;
    this.component_class = component_class;
    this.component_name = component_name;
    this.is_line = is_line;
    this.is_group = is_group;
    this.is_visible = is_visible;

    if (create_function != undefined) {
      this.create = create_function;
    } else {
      this.create = create_const;
    }
    this.properties = properties; //<- properties are not models, this is a list of possible properties
    this.headers = headers; //this is function that returns a model
    // this.codes = codes; //this is a pair of value and model, and also owns, values
    this.footers = footers; //this is a pair of value and model, and also owns, values
  }
}

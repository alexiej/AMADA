import Code from "./Code";
// import ModelCreator from "./ModelCreator";

const create_const = (model, value, properties = [], codes = []) => {
  let headers = [];
  for (let m of model.headers) {
    headers.push(m.create(value));
  }
  let footers = [];
  for (let m of model.footers) {
    footers.push(m.create(value));
  }
  return new Code(model, value, properties, codes, headers, footers);
};

export const MODEL_SECTION = -2;
export const MODEL_LINE = -1;
export const MODEL_INLINE = 1;
export const MODEL_GROUP = 2;

// const prefix_type = {
//   String(MODEL_LINE): "line",
//   String(MODEL_INLINE): "inline",
//   String(MODEL_SECTION): "section",
//   String(MODEL_GROUP: "group"
// };

const __prefix_type = ["section", "line", "", "inline", "group"];
function prefix_type(type) {
  return __prefix_type[type + 2];
}

/**
 * usually schema for the model is undefined
 */
export class Model {
  constructor(
    id,
    name,
    component_class = "",
    component_name,
    type = MODEL_LINE,
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
    this.type = type;
    // this.is_line = is_line;
    // this.is_group = is_group;
    this.is_visible = is_visible;

    if (create_function != undefined) {
      this.create_function = create_function;
    } else {
      this.create_function = create_const;
    }
    this.properties = properties; //<- properties are not models, this is a list of possible properties
    this.headers = headers; //this is function that returns a model
    // this.codes = codes; //this is a pair of value and model, and also owns, values
    this.footers = footers; //this is a pair of value and model, and also owns, values

    this.header_class = prefix_type(type) + "-header";
    this.codes_class = prefix_type(type) + "-codes";
    this.footer_class = prefix_type(type) + "-footer";
    this.item_class = prefix_type(type) + "-item";

    // // let prefix = (type == 0 ? 'line' type==2)
    // switch(type) {
    //   case 0:
    //     this.headers_class = 'line-header';
    //     this.codes_class =

    //     break;
    //   case 1:
    //     break;
    //   case 2:
    //     break;
    //   case 3:
    //     break;
    // }
  }

  get is_block() {
    return this.type < 0;
  }

  get is_line() {
    return this.type == -1;
  }

  get is_section() {
    return this.type == -2;
  }

  get is_inline() {
    return this.type == 1;
  }

  get is_group() {
    return this.type == 2;
  }

  toString() {
    return this.id;
  }

  create(value, properties = [], codes = []) {
    return this.create_function(this, value, properties, codes);
  }
}

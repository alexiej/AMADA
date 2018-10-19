import Code from "./Code";
// import { View } from "./View";
// import ModelCreator from "./ModelCreator";
// export const MODEL_SECTION = -2;
// export const MODEL_LINE = -1;
// export const MODEL_INLINE = 1;
// export const MODEL_GROUP = 2;

// export const CODE_HEADER = -1;
// export const CODE_CODES = 0;
// export const CODE_FOOTER = 1;

const create_const = (model, key, value, properties = [], codes = []) => {
  return new Code(model, key, value, properties, codes);
};

/**
 * usually schema for the model is undefined
 */
export class Model {
  constructor({
    id,
    name,
    view_id = "", //<- default view for the model, name
    generator_id = "code", //<- default generator for the file
    create_function = undefined,
    is_visible = true,
    has_value = true
  }) {
    this.schema = undefined;
    this.id = id;
    this.name = name;
    this.has_value = has_value;
    this.generator_id = generator_id;

    if (create_function != undefined) {
      this.create_function = create_function;
    } else {
      this.create_function = create_const;
    }
    this.view_id = view_id;
    this.is_visible = is_visible;
  }

  toString() {
    return this.id;
  }

  preview(code, generator_id) {
    if (!(generator_id in this.schema.generators)) return "";
    let g = this.schema.generators[generator_id];

    if (this.generator_id in g) {
      return g[this.generator_id](code, generator_id);
    }
    if ("*" in g) {
      return g["*"](code, generator_id);
    }
    return "";
  }

  create(key, value, properties = [], codes = []) {
    return this.create_function(this, key, value, properties, codes);
  }
}

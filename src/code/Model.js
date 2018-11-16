import Code from "./Code";
import Property from "./Property";
// import { View } from "./View";
// import ModelCreator from "./ModelCreator";
// export const MODEL_SECTION = -2;
// export const MODEL_LINE = -1;
// export const MODEL_INLINE = 1;
// export const MODEL_GROUP = 2;
// export const CODE_HEADER = -1;
// export const CODE_CODES = 0;
// export const CODE_FOOTER = 1;

const create_const = (model, value, properties = [], codes = []) => {
  return new Code(model, value, properties, codes);
};

const convert_const = (model, code) => {
  return model.create(code.value, code.properties, code.codes);
};

/**
 * usually schema for the model is undefined
 */
export class Model {
  constructor({
    id,
    name,
    allowed = undefined,
    view_id = "", //<- default view for the model, name
    generator_id = "code", //<- default generator for the file
    create_function = undefined,
    convert_function = undefined,
    is_visible = true
  }) {
    this.schema = undefined;
    this.id = id;
    this.name = name;
    this.generator_id = generator_id;
    this.allowed = allowed;

    if (create_function != undefined) {
      this.create_function = create_function;
    } else {
      this.create_function = create_const;
    }

    if (convert_function != undefined) {
      this.convert_function = convert_function;
    } else {
      this.convert_function = convert_const;
    }

    this.view_id = view_id;
    this.is_visible = is_visible;
  }

  toString() {
    return this.id;
  }

  convert(code) {
    return this.convert_function(this, code);
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

  create(value, properties = [], codes = []) {
    return this.create_function(this, value, properties, codes);
  }

  properties(list) {
    let arr = [];
    for (let l of list) {
      arr.push(this.property(l.key, l.value));
    }
    return arr;
  }

  property(key, value) {
    return new Property(key, value);
  }
}

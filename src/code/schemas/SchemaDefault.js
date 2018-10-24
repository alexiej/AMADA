import Schema from "../Schema.js";
import { Model } from "../Model";
import { Template } from "../Template.js";

import {
  VIEW_GROUP,
  VIEW_LINE,
  VIEW_SECTION,
  VIEW_TEXT
} from "../../amada/views/CodeView";

export function get_model_schema(name, schema = {}) {
  let oa = Object.assign(
    {
      id: name,
      name: name,
      view_id: name,
      generator_id: name,
      description: name,
      allowed: parent => Object.keys(parent.schema.models)
    },
    schema
  );
  let m = new Model(oa);
  return m;
}

export function models_default(models = {}) {
  models["line"] = get_model_schema("line", models["line"]); //, "line", "amada-line", MODEL_LINE));
  models["inline"] = get_model_schema("inline", models["inline"]);
  models["text"] = get_model_schema("text", models["text"]);
  models["section-part"] = get_model_schema(
    "section-part",
    models["section-part"]
  );
  models["group"] = get_model_schema("group", models["group"]);
  models["section"] = get_model_schema("section", models["section"]);

  return models;
}

import amada_gen from "../generators/amada";

export function generators_default(func = amada_gen, generators = {}) {
  let v = {
    "*": func, //<- default if we couldn't found any generator
    line: func,
    inline: func,
    text: func,
    value: func,
    "section-part": func,
    group: func,
    section: func
  };

  Object.assign(v, generators);
  return v;
}

export function templates_default(templates = {}) {
  Object.assign(templates, {
    text: new Template({
      component_class: "text",
      view_type: VIEW_GROUP,
      is_select: true
    }),
    content: new Template({
      component_class: "content",
      component_name: "amada-content",
      view_type: VIEW_LINE,
      is_select: true,
      header: {
        is_visible: true,
        prefix: "",
        display_val: "value",
        suffix: ""
      },
      footer: {
        is_visible: false
      }
    }),
    inline: new Template({
      component_class: "inline",
      view_type: VIEW_GROUP,
      is_select: true
    }),
    line: new Template({
      component_class: "line",
      view_type: VIEW_LINE,
      is_select: true,
      header: {
        is_visible: true,
        prefix: "",
        display_val: "value",
        suffix: ""
      },
      footer: {
        is_visible: false
      }
    }),
    key: new Template({
      component_class: "key",
      view_type: VIEW_LINE,
      is_select: true,
      header: {
        is_visible: true,
        prefix: "",

        between: "",
        display_val: "value",
        suffix: ": "
      },

      footer: {
        is_visible: false
      }
    }),
    section: new Template({
      component_class: "section",
      view_type: VIEW_SECTION,
      is_select: true,
      header: {
        is_visible: true,
        prefix: "",
        display_val: "value",
        suffix: ""
      },

      footer: {
        is_visible: false,
        prefix: "/",
        display_val: "value",
        suffix: ""
      }
    }),
    comment: new Template({
      component_class: "comment",
      component_name: "amada-content",
      view_type: VIEW_SECTION,
      is_select: true,
      header: {
        is_visible: true,
        prefix: "",
        suffix: "",
        display_val: "value"
      },
      footer: {
        is_visible: true,
        prefix: "",
        suffix: ""
      }
    }),
    "section-part": new Template({
      component_class: "section-part",
      view_type: VIEW_SECTION,
      is_select: true,
      header: {
        is_visible: true,
        prefix: "",
        suffix: "",
        display_value: ""
      },
      footer: {
        is_visible: true,
        prefix: "-----END OF FILE------------------------------"
      }
    })
  });
  return templates;
}

export class SchemaDefault extends Schema {
  constructor() {
    super(
      "default",
      "default",
      models_default(),
      {
        default: templates_default()
      },
      {
        amada: generators_default(amada_gen)
      }
    );
  }
}

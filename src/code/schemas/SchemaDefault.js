import Schema from "../Schema.js";
import { Model } from "../Model";
import {
  TEMPLATE_SECTION,
  TEMPLATE_LINE,
  TEMPLATE_INLINE,
  TEMPLATE_GROUP,
  Template
} from "../Template.js";

export function models_default(models = []) {
  models.push(
    new Model({
      id: "line",
      name: "line",
      view_id: "line",
      generator_id: "line",
      has_value: true
    })
  ); //, "line", "amada-line", MODEL_LINE));
  models.push(
    new Model({
      id: "inline",
      name: "inline",
      view_id: "inline",
      generator_id: "inline"
    })
  );
  models.push(
    new Model({
      id: "text",
      name: "text",
      view_id: "text",
      generator_id: "text"
    })
  );
  models.push(
    new Model({
      id: "section-part",
      name: "section-part",
      view_id: "section-part",
      generator_id: "section-part",
      has_value: false
    })
  );
  models.push(
    new Model({
      id: "group",
      name: "group",
      view_id: "group",
      generator_id: "group",
      has_value: false
    })
  );
  models.push(
    new Model({
      id: "section",
      name: "section",
      view_id: "section",
      generator_id: "section",
      has_value: false
    })
  );

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
      type: TEMPLATE_INLINE,
      is_select: true
    }),
    inline: new Template({
      component_class: "inline",
      type: TEMPLATE_INLINE,
      is_select: true
    }),
    line: new Template({
      component_class: "line",
      type: TEMPLATE_LINE,
      is_select: true,
      header: {
        is_visible: true,
        prefix: "",
        display_key: "",
        display_val: "value",
        suffix: ""
      },
      footer: {
        is_visible: false
      }
    }),

    value: new Template({
      component_class: "value",
      type: TEMPLATE_LINE,
      is_select: true,
      header: {
        is_visible: true,
        prefix: "",

        display_key: "key",
        between: ": ",
        display_val: "value",
        suffix: ""
      },

      footer: {
        is_visible: false
      }
    }),
    section: new Template({
      component_class: "section",
      type: TEMPLATE_SECTION,
      is_select: true,
      header: {
        is_visible: true,
        prefix: "",

        display_key: "key",

        suffix: ""
      },

      footer: {
        is_visible: false,
        prefix: "/",
        display_key: "key",
        display_val: "",
        suffix: ""
      }
    }),
    comment: new Template({
      component_class: "comment",
      type: TEMPLATE_SECTION,
      is_select: true,
      header: {
        is_visible: true,
        prefix: "",
        suffix: "",
        display_key: "",
        display_val: "value"
      },
      footer: {
        is_visible: true,
        prefix: "",
        suffix: ""
        // display_value: ""
      }
    }),
    "section-part": new Template({
      component_class: "section-part",
      type: TEMPLATE_SECTION,
      is_select: true,
      header: {
        is_visible: true,
        prefix: "",
        suffix: "",
        display_value: ""
        // display_key: key => key,
        // display_value: ""
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

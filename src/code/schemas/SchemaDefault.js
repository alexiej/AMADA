import Schema from "../Schema.js";
import {
  Model,
  MODEL_INLINE,
  MODEL_LINE,
  MODEL_SECTION,
  MODEL_GROUP
} from "../Model";

// import { CreatorValue } from "../Creators.js";
// import Section from "../models/Section";
// import Properties from "../models/Properties";
// import SectionLine from "../models/SectionInline";
// import Line from "../models/Line";
// import Inline from "../models/Inline";
/**
 * 
 *   id,
    name,
    component_class = "",
    component_name,
    type = 0, //<-0 line, 1 - inline, 2 - section, 3 - inline group
    is_visible = true,
    properties = [],
    headers = [],
    footers = [],
    create_function = undefined
 */
export function models_default(models = []) {
  models.push(new Model("line", "line", "line", "amada-line", MODEL_LINE));
  models.push(
    new Model("inline", "inline", "inline", "amada-inline", MODEL_INLINE)
  );
  models.push(
    new Model(
      "section-part",
      "section-part",
      "section-part",
      "amada-section",
      MODEL_SECTION
    )
  );
  models.push(
    new Model(
      "section-inline",
      "section-inline",
      "section-inline",
      "amada-inline",
      MODEL_GROUP
    )
  );
  models.push(
    new Model(
      "section",
      "section",
      "section",
      "amada-section",
      MODEL_SECTION,
      true,
      [],
      [
        new Model(
          "section-header",
          "section-header",
          "line",
          "amada-line",
          MODEL_LINE
        )
      ],
      [
        new Model(
          "section-footer",
          "section-footer",
          "line",
          "amada-line",
          MODEL_LINE
        )
      ]
    )
  );

  // models.push(new Section(schema));
  // models.push(new Properties(schema));
  // models.push(new Line(schema, "section-header", "section-header"));
  // models.push(new Line(schema, "section-footer", "section-footer"));
  // models.push(new SectionLine(schema));
  return models;
}

export class SchemaDefault extends Schema {
  constructor() {
    super("default", "default", models_default());
  }
}

import Schema from "../Schema.js";
import Model from "../Model";
// import { CreatorValue } from "../Creators.js";
// import Section from "../models/Section";
// import Properties from "../models/Properties";
// import SectionLine from "../models/SectionInline";
// import Line from "../models/Line";
// import Inline from "../models/Inline";

export function models_default(models = []) {
  models.push(new Model("line", "line", "line", "amada-line", true, false));
  models.push(
    new Model("inline", "inline", "inline", "amada-inline", false, false)
  );
  models.push(
    new Model(
      "section-part",
      "section-part",
      "section",
      "amada-section",
      false,
      false
    )
  );
  models.push(
    new Model(
      "section-inline",
      "section-inline",
      "inline",
      "amada-inline",
      false,
      true
    )
  );
  models.push(
    new Model(
      "section",
      "section",
      "section",
      "amada-section",
      true,
      false,
      true,
      [],
      [
        new Model(
          "section-header",
          "section-header",
          "line",
          "amada-line",
          true,
          false,
          true
        )
      ],
      [
        new Model(
          "section-footer",
          "section-footer",
          "line",
          "amada-line",
          true,
          false,
          true
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

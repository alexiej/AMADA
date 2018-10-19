import Schema from "../Schema.js";
import Part from "../Part.js";
import {
  models_default,
  templates_default,
  generators_default
} from "./SchemaDefault";

function create_codes(m, len = 5) {
  var codes = [];
  for (let i = 1; i < len; i++) {
    codes.push(
      m.section.create(
        "group1",
        "group1",
        [],
        [
          m.line.create(
            "line1",
            "line1",
            [],
            [
              m.inline.create("code1", "code1"),
              m.inline.create("code2", "code2"),
              m.inline.create("code3", "code3"),
              m.inline.create("code4", "code4")
            ]
          ),
          m.line.create("line2", "line2"),
          m.line.create("line3", "line3")
        ]
      )
    );
    codes.push(
      m.section.create(
        "group",
        "group2",
        [],
        [m.inline.create("line", "code5"), m.inline.create("line", "code7")]
      )
    );
  }
  return codes;
}

export default class SchemaMock extends Schema {
  constructor() {
    super(
      "mock",
      "mock",
      models_default(),
      {
        default: templates_default()
      },
      generators_default()
    );
  }

  parts_decode(file) {
    let m = this.models;

    let parts = [
      new Part(file, "main", "main", this, [
        m.section.create(
          "code",
          "A" + Math.random() * 100,
          [],
          create_codes(m, 5)
        )
      ]),
      new Part(file, "main2", "main2", this, [
        m.section.create(
          "code",
          "B1" + Math.random() * 100,
          [],
          create_codes(m, 5)
        ),
        m.section.create(
          "code",
          "B2" + Math.random() * 100,
          [],
          create_codes(m, 5)
        )
      ])
    ];

    return parts;
  }
}

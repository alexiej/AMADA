import Schema from "../Schema.js";
import Part from "../Part.js";
import { models_default } from "./SchemaDefault";

function create_codes(m, len = 5) {
  var codes = [];
  for (let i = 1; i < len; i++) {
    codes.push(
      m.section.create(
        "group1",
        [],
        [
          m.line.create(
            "line1",
            [],
            [
              [
                m.inline.create("code1"),
                m.inline.create("code2"),
                m.inline.create("code3"),
                m.inline.create("code4")
              ]
            ]
          ),
          m.line.create("line2"),
          m.line.create("line3")
        ]
      )
    );
    codes.push(m.section.create("group2", []));
  }
  return codes;
}

export default class SchemaMock extends Schema {
  constructor() {
    super("mock", "mock", models_default());
  }

  parts_decode(file) {
    let m = this.models;

    let parts = [
      new Part("main", "main", this, [
        m.section.create("A" + Math.random() * 100, [], create_codes(m, 5))
      ]),
      new Part("main2", "main2", this, [
        m.section.create("B1" + Math.random() * 100, [], create_codes(m, 5)),
        m.section.create("B2" + Math.random() * 100, [], create_codes(m, 5))
      ])
    ];

    return parts;

    //     new Code(
    //       this.models.section,
    //       "A" + Math.random() * 100,
    //       create_codes(this, 54)
    //     )
    //   ]),
    //   new Part("main2", "main 2", [
    //     new Code(
    //       this.models.section,
    //       "B" + Math.random() * 100,
    //       create_codes(this, 25)
    //     ),
    //     new Code(
    //       this.models.section,
    //       "B" + Math.random() * 100,
    //       create_codes(this, 32)
    //     )
    //   ])
    // ];
  }
}

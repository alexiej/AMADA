import Schema from "../Schema.js";
import Part from "../Part.js";
import Code from "../Code.js";
import { models_default } from "./SchemaDefault";

function create_codes(amada, len = 5) {
  var codes = [];
  for (let i = 1; i < len; i++) {
    codes.push(
      new Code(amada.models.section, "group" + i, [
        new Code(amada.models.line, "line1", [
          new Code(amada.models.inline, "code1" + Math.random()),
          new Code(amada.models.inline, "code2"),
          new Code(amada.models.inline, "code3"),
          new Code(amada.models.inline, "code4")
        ]),
        new Code(amada.models.line, "line2"),
        new Code(amada.models.line, "line3"),
        new Code(amada.models.line, "line4")
      ])
    );
  }
  return codes;
}

export default class SchemaMock extends Schema {
  constructor() {
    super("mock", "mock", models_default());
  }

  parts_decode(file) {
    return [
      new Part("main", "main", [
        new Code(
          this.models.section,
          "A" + Math.random() * 100,
          create_codes(this, 54)
        )
      ]),
      new Part("main2", "main 2", [
        new Code(
          this.models.section,
          "B" + Math.random() * 100,
          create_codes(this, 25)
        ),
        new Code(
          this.models.section,
          "B" + Math.random() * 100,
          create_codes(this, 32)
        )
      ])
    ];
  }
}

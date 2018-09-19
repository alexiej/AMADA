import Schema from "../Schema.js";
import Part from "../Part.js";
import Code from "../Code.js";
import { models_default } from "./SchemaDefault";

const fs = require("fs");
const { promisify } = require("util");
const readFile = promisify(fs.readFile);
import { parse } from "himalaya";

export default class SchemaHtml extends Schema {
  constructor() {
    super("html", "html", models_default());
  }

  async parts_decode(file) {
    let text = (await readFile(file.path)).toString();
    let json = parse(text);

    // fs.readFile("input.txt", function(err, data) {
    //   if (err) {
    //     return console.error(err);
    //   }

    // });

    return [
      new Part("html", "html", [
        new Code(this.models.section, "A" + Math.random() * 100)
      ])
    ];
  }
}

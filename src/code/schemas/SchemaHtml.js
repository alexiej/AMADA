import Schema from "../Schema.js";
import Part from "../Part.js";
import Code from "../Code.js";
import {
  models_default,
  templates_default,
  generators_default
} from "./SchemaDefault";

const fs = require("fs");
const { promisify } = require("util");
const readFile = promisify(fs.readFile);
import { parse } from "himalaya";
import { Model } from "../Model";

function __get_properties(code) {
  if (code.properties.length > 0) {
    var arr = [];
    for (let p of code.properties) {
      if (p.value == undefined || p.value == "") {
        arr.push(" " + p.key);
      } else {
        arr.push(" " + p.key + "='" + p.value + "'");
      }
    }
    return arr.join("");
  }
  return "";
}

function get_empty(code, generator_id) {
  // return "BB";
  return "";
}

function comment_gen(code, generator_id) {
  return "<!-- " + code.value + " -->";
}

function section_get(code, generator_id) {
  var arr = [];
  for (let c of code.codes) {
    arr.push(c.preview(generator_id));
  }
  return "<!DOCTYPE HTML>\n" + arr.join("");
}

function codes_get(code, generator_id) {
  var arr = [];
  for (let c of code.codes) {
    arr.push(c.preview(generator_id));
  }
  return arr.join("");
}

const __HTML__SOLIDUS_TAG = { META: true, LINK: true, TITLE: true };

function __get_html_end_tag(tag) {
  if (tag.toUpperCase() in __HTML__SOLIDUS_TAG) {
    return "/>";
  } else {
    return "></" + tag + ">";
  }
}

function __get_html_code(tag, properties, content) {
  return (
    "<" +
    tag +
    properties +
    (content.length > 0
      ? ">\n" + content + "\n</" + tag + ">"
      : __get_html_end_tag(tag) + "\n")
  );
}

function __get_html_line_code(tag, properties, content) {
  return (
    "<" +
    tag +
    properties +
    (content.length > 0
      ? ">" + content + "</" + tag + ">\n"
      : __get_html_end_tag(tag) + "\n")
  );
}

function line_gen(code, generator_id) {
  console.log("code line", code);
  return __get_html_code(code.key, __get_properties(code), code.value);
}

function tagline_gen(code, generator_id) {
  console.log("tagline_gen line", code);
  return __get_html_line_code(code.key, __get_properties(code), code.value);
}

/** Standard generator for code in the file */
function html_gen(code, generator_id) {
  return __get_html_code(
    code.value,
    __get_properties(code),
    codes_get(code, generator_id)
  );
}

function is_empty(text) {
  return text == "" || text == undefined || text.trim() == "";
}

function create_codes(schema, json) {
  var tagName = "";
  let model = undefined;
  let code = undefined;

  let codes = [];
  for (let tag of json) {
    switch (tag.type) {
      case "text":
        if (is_empty(tag.content)) continue;
        codes.push(schema.models["line"].create("line", tag.content));
        // console.warn("content: ", tag.content);
        break;
      case "element":
        if (tag.tagName == "!doctype") continue;
        tagName = "tag-" + tag.tagName;

        if (tag.tagName == "title") {
          model = schema.models["tag-line"];
          // console.log(tag.tagName, tag.children[0].content);
          code = model.create(
            tag.tagName,
            tag.children[0].content.trim(),
            [],
            []
          );
          codes.push(code);
          continue;
        }

        if (tagName in schema.models) {
          model = schema.models[tagName];
        } else {
          model = schema.models["tag"];
        }
        // switch (tag.tagName) {
        //   case "title":
        //     console.log(tag.children[0]);
        //     model.create(tag.tagName, tag.children[0].content, [], []);
        //     codes.push(code);
        //     return;
        // }
        // console.log(tag.type, tagName, tag.children);
        code = model.create(
          tag.tagName,
          tag.tagName,
          tag.attributes,
          create_codes(schema, tag.children)
        );
        // console.log(code);
        codes.push(code);
        // console.log(tag.attributes);
        // model.crea
        // console.log(tag, tagName, model);

        break;
      case "comment":
        if (is_empty(tag.content)) continue;
        codes.push(schema.models["comment"].create("comment", tag.content));
        break;
      default:
        console.warn("other", tag);
        break;
    }
    // if (tag.type == "text") {
    // }
  }
  return codes;
}

export default class SchemaHtml extends Schema {
  constructor() {
    super(
      "html",
      "html",
      models_default([
        new Model({
          id: "tag",
          name: "tag",
          view_id: "section",
          has_value: false
        }),
        new Model({
          id: "tag-line",
          name: "tag-line",
          view_id: "value",
          generator_id: "tag-line",
          has_value: true
        }),
        new Model({
          id: "comment",
          name: "comment",
          view_id: "comment",
          generator_id: "comment"
        }),
        new Model({
          id: "tag-!doctype",
          name: "!doctype",
          view_id: "line"
        })
      ]),
      {
        default: templates_default()
      },
      {
        amada: generators_default(),
        html: generators_default(codes_get, {
          "*": html_gen,
          "section-part": section_get,
          comment: comment_gen,
          line: line_gen,
          "tag-line": tagline_gen
        })
      }
    );
  }

  async parts_decode(file) {
    let text = (await readFile(file.path)).toString();
    let json = parse(text);

    let part = new Part(file, "HTML", "HTML", this, create_codes(this, json));
    return [part];
  }

  preview(file, generator_id = "html") {
    return file.parts[0].section.preview(generator_id);
  }
}

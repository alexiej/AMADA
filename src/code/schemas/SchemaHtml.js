import Schema from "../Schema.js";
import Part from "../Part.js";
import Code from "../Code.js";
import {
  models_default,
  templates_default,
  generators_default,
  get_model_schema
} from "./SchemaDefault";

import { escapeHtml } from "../__helpers";

const fs = require("fs");
const { promisify } = require("util");
const readFile = promisify(fs.readFile);
import { parse } from "himalaya";
import { Model } from "../Model";

// function ver_regex(regex) {
//   return function(parent, model, value) {
//     if (regex.match(value)) return true;
//     return false;
//   };
// }

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

function content_gen(code, generator_id) {
  return escapeHtml(code.value);
}

function comment_gen(code, generator_id) {
  return "<!-- " + escapeHtml(code.value) + " -->";
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

const convert_function = (model, code) => {
  if (
    ["comment", "content"].indexOf(code.model.id) >= 0 &&
    ["comment", "content"].indexOf(model.id) < 0
  ) {
    return model.create(code.model.name, [], [code]);
  }
  return model.create(
    code.value,
    model.properties(code.properties),
    code.codes
  );
};

const convert_content = (model, code) => {
  return new Code(
    model,
    "comment section (" + code.model.name + ")",
    [],
    [code]
  );
};

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
  return escapeHtml(code.value); //, __get_properties(code), code.value);
}

function tagline_gen(code, generator_id) {
  return __get_html_line_code(
    code.value,
    __get_properties(code),

    escapeHtml(code.codes[0].value)
  );
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
        codes.push(schema.models["line"].create(tag.content));
        break;
      case "element":
        if (tag.tagName == "!doctype") continue;
        tagName = tag.tagName;

        if (tag.tagName == "title") {
          model = schema.models["tag-line"];
          // console.log(tag.tagName, tag.children[0].content);
          code = model.create(
            tag.tagName,
            [],
            [
              schema.models["content"].create(
                tag.children[0].content.trim(),
                [],
                []
              )
            ]
          );
          codes.push(code);
          continue;
        }

        if (tagName in schema.models) {
          model = schema.models[tagName];
        } else {
          model = schema.models["tag"];
        }

        // console.log(tag.type, tagName, tag.children);
        code = model.create(
          tag.tagName,
          model.properties(tag.attributes),
          create_codes(schema, tag.children)
        );
        codes.push(code);

        break;
      case "comment":
        if (is_empty(tag.content)) continue;
        codes.push(schema.models["comment"].create(tag.content));
        break;
      default:
        console.warn("other", tag);
        break;
    }
  }
  return codes;
}

function allowed(parent) {
  return ["tag", "tag-line", "content", "comment"];
}

const all_models = models_default({
  html: get_model_schema("html", {
    view_id: "section",
    allowed: parent => ["head", "body"],
    convert_function
  }),
  body: get_model_schema("body", {
    view_id: "section",
    allowed,
    convert_function
  }),
  head: get_model_schema("head", {
    view_id: "section",
    allowed,
    convert_function
  }),
  tag: get_model_schema("tag", {
    view_id: "section",
    allowed,
    convert_function
  }),
  "tag-line": get_model_schema("tag-line", {
    name: "line tag",
    view_id: "key",
    allowed,
    convert_function
  }),
  content: get_model_schema("content", {
    convert_function: convert_content
  }),
  comment: get_model_schema("comment", {
    convert_function: convert_content
  }),
  section: { name: "HTML Section" },
  "section-part": {
    allowed: parent => {
      return ["html"];
    }
  }
});

export default class SchemaHtml extends Schema {
  constructor() {
    super(
      "html",
      "html",
      all_models,
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
          content: content_gen,
          "tag-line": tagline_gen
        })
      }
    );
    this.preview_default = "html";
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

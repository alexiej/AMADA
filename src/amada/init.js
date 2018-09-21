import Project from "../code/Project";

import EditorView from "./views/EditorView";
import View from "./View";

import SchemaMock from "../code/schemas/SchemaMock";
import SchemaHtml from "../code/schemas/SchemaHtml";
import { SchemaDefault } from "../code/schemas/SchemaDefault";

export const project = new Project(); //empty project

export const editor_view = new EditorView("editor/-", project.file); //empty editor view
export const about = new View("view/about", "about");

// export const models = {
//   section: new Section(),
//   line: new Line(),
//   inline: new Inline()
// };

export const keys = {
  global: {},
  editor: {}, //for all editors and modes
  // "editor/edit/section": {}, //view/mode/code name
  "editor/edit": {
    //this means that this is when active is code
    //this is standard view for editor
    i: { target: "editor", action: "up", par: 1 },
    k: { target: "editor", action: "down", par: 1 },
    j: { target: "editor", action: "prev", par: 1 },
    l: { target: "editor", action: "next", par: 1 }
  }
};

export const schemas = {
  default: new SchemaDefault(),
  mock: new SchemaMock(),
  html: new SchemaHtml()
};

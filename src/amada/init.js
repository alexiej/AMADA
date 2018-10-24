import Project from "../code/Project";

// import EditorView from "./views/EditorView";
import View from "./View";

import SchemaMock from "../code/schemas/SchemaMock";
import SchemaHtml from "../code/schemas/SchemaHtml";
import { SchemaDefault } from "../code/schemas/SchemaDefault";

export const project = new Project(); //empty project

export const about = new View("view/about", "about");

export const keys = {
  global: {},
  editor: {}, //for all editors and modes
  // "editor/edit/section": {}, //view/mode/code name
  "editor/rename": {
    Escape: { target: "editor", action: "set_mode", par: "view" },
    "^e": { target: "editor", action: "set_mode", par: "view" }
  },
  "editor/add": {
    Escape: { target: "editor", action: "set_mode", par: "view" },
    "^e": { target: "editor", action: "set_mode", par: "view" }
  },
  "editor/view": {
    //this means that this is when active is code
    //this is standard view for editor
    i: { target: "editor", action: "up", par: 1 },
    k: { target: "editor", action: "down", par: 1 },
    j: { target: "editor", action: "prev", par: 1 },
    l: { target: "editor", action: "next", par: 1 },
    o: { target: "editor", action: "preview", par: 1 },
    "^o": { target: "editor", action: "preview", par: 1 },

    ArrowUp: {
      target: "editor",
      action: "up",
      par: 1,
      prevent: true
    },
    ArrowDown: {
      target: "editor",
      action: "down",
      par: 1,
      prevent: true
    },
    ArrowLeft: {
      target: "editor",
      action: "prev",
      par: 1,
      prevent: true
    },
    ArrowRight: {
      target: "editor",
      action: "next",
      par: 1,
      prevent: true
    },

    I: { target: "editor", action: "up_item", par: 1 },
    K: { target: "editor", action: "down_item", par: 1 },
    J: { target: "editor", action: "prev_item", par: 1 },
    L: { target: "editor", action: "next_item", par: 1 },

    ARROWUP: { target: "editor", action: "up_item", par: 1 },
    ARROWDOWN: { target: "editor", action: "down_item", par: 1 },
    ARROWLEFT: { target: "editor", action: "prev_item", par: 1 },
    ARROWRIGHT: { target: "editor", action: "next_item", par: 1 },

    s: { target: "editor", action: "save" },
    "^s": { target: "editor", action: "save" },

    E: { target: "editor", action: "replace", prevent: true },
    e: { target: "editor", action: "set_mode", par: "edit" },

    a: { target: "editor", action: "add_after", prevent: true },
    A: { target: "editor", action: "add_before", prevent: true },

    d: { target: "editor", action: "delete", prevent: true, par: false },
    D: {
      target: "editor",
      action: "delete_with_children",
      prevent: true,
      par: true
    }
  },

  "editor/edit": {
    Escape: { target: "editor", action: "set_mode", par: "view" },
    "^e": { target: "editor", action: "set_mode", par: "view" },

    "^i": { target: "editor", action: "cursor_up", par: 1 },
    "^k": { target: "editor", action: "cursor_down", par: 1 },
    "^j": { target: "editor", action: "cursor_prev", par: 1 },
    "^l": { target: "editor", action: "cursor_next", par: 1 },

    "^J": { target: "editor", action: "cursor_first_in_line", par: 1 },
    "^L": { target: "editor", action: "cursor_last_in_line", par: 1 },
    Home: { target: "editor", action: "cursor_first_in_line", par: 1 },
    End: { target: "editor", action: "cursor_last_in_line", par: 1 },

    "^o": { target: "editor", action: "preview", par: 1 },

    ARROWLEFT: { target: "editor", action: "cursor_first_in_line", par: 1 },
    ARROWRIGHT: { target: "editor", action: "cursor_last_in_line", par: 1 },

    ArrowUp: { target: "editor", action: "cursor_up", par: 1 },
    ArrowDown: { target: "editor", action: "cursor_down", par: 1 },
    ArrowLeft: {
      target: "editor",
      action: "cursor_prev",
      par: 1,
      prevent: true
    },
    ArrowRight: {
      target: "editor",
      action: "cursor_next",
      par: 1,
      prevent: true
    },
    "^d": { target: "part", action: "del_text", par: 1 },
    "^D": { target: "part", action: "back_text", par: 1 },

    ALL: { target: "editor", action: "key" }
  }
};

export const schemas = {
  default: new SchemaDefault(),
  mock: new SchemaMock(),
  html: new SchemaHtml()
};

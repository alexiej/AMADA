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
    Escape: { target: "editor", action: "mode_set_view" },
    "^e": { target: "editor", action: "mode_set_view" }
  },
  "editor/add": {
    Escape: { target: "editor", action: "mode_set_view" },
    "^e": { target: "editor", action: "mode_set_view" }
  },
  "editor/view": {
    //this means that this is when active is code
    //this is standard view for editor
    "1": { target: "editor", action: "repeat", par: "1" },
    "2": { target: "editor", action: "repeat", par: "2" },
    "3": { target: "editor", action: "repeat", par: "3" },
    "4": { target: "editor", action: "repeat", par: "4" },
    "5": { target: "editor", action: "repeat", par: "5" },
    "6": { target: "editor", action: "repeat", par: "6" },
    "7": { target: "editor", action: "repeat", par: "7" },
    "8": { target: "editor", action: "repeat", par: "8" },
    "9": { target: "editor", action: "repeat", par: "9" },
    "0": { target: "editor", action: "repeat", par: "0" },

    i: { target: "editor", action: "up", par: 1 },
    "^i": { target: "editor", action: "info", par: 1 },
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

    e: { target: "editor", action: "mode_set_edit", par: true },
    E: { target: "editor", action: "view_replace", prevent: true },

    a: { target: "editor", action: "view_add_after", prevent: true },
    A: { target: "editor", action: "view_add_before", prevent: true },

    "^A": {
      target: "editor",
      action: "view_add_parent",
      prevent: true,
      par: 1
    },
    "^a": {
      target: "editor",
      action: "view_add_children",
      prevent: true,
      par: 1
    },

    d: { target: "editor", action: "view_delete", prevent: true, par: false },
    D: {
      target: "editor",
      action: "view_delete",
      prevent: true,
      par: true
    }
  },

  "editor/edit": {
    Escape: { target: "editor", action: "mode_set_view" },
    "^e": { target: "editor", action: "mode_set_view" },

    "^i": { target: "part", action: "edit_prev_line" },
    ArrowUp: { target: "part", action: "edit_prev_line" },

    "^k": { target: "part", action: "edit_next_line" },
    ArrowDown: { target: "part", action: "edit_next_line" },

    "^j": { target: "part", action: "edit_prev", par: 1 },
    "^l": { target: "part", action: "edit_next", par: 1 },

    "^J": { target: "part", action: "edit_first_in_line" },
    "^L": { target: "part", action: "edit_last_in_line" },
    Home: { target: "part", action: "edit_first_in_line" },
    End: { target: "part", action: "edit_last_in_line" },

    ARROWLEFT: { target: "part", action: "edit_first_in_line" },
    ARROWRIGHT: { target: "part", action: "edit_last_in_line" },

    "^o": { target: "editor", action: "preview", par: 1 },

    ArrowLeft: {
      target: "part",
      action: "edit_prev",
      par: 1,
      prevent: true
    },
    ArrowRight: {
      target: "part",
      action: "edit_next",
      par: 1,
      prevent: true
    },
    "^d": { target: "part", action: "edit_delete", par: 1 },
    "^D": { target: "part", action: "edit_backspace", par: 1 },

    ALL: { target: "editor", action: "key" }
  }
};

export const schemas = {
  default: new SchemaDefault(),
  mock: new SchemaMock(),
  html: new SchemaHtml()
};

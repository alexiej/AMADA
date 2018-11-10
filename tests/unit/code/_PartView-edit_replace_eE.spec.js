import { expect, use } from "chai";
import { shallowMount } from "@vue/test-utils";

import EditorView from "../../../src/amada/views/EditorView";
// import HelloWorld from "@/components/HelloWorld.vue";
import { json, jsone } from "../helpers";
import amada from "../mock";

var finish = false;
let path = "../test/index.html";
let file = undefined;
let ev = undefined;
let pv = undefined;

// pv = ev.part_view;
const { assert } = require("chai");

describe("ParView-edit_replace.spec.js", () => {
  it("go edit - comment", async () => {
    file = await amada.file_get(path);
    ev = new EditorView(amada, "id", file);
    pv = ev.part_view;
  });

  it("go to tag(3) ", async () => {
    ev.down(5);
    ev.next();
    expect(pv.cursor_code.info).to.eq("tag/rel:icon (15)");
  });

  it("edit", async () => {
    ev.set_mode_edit();
    expect(ev.mode).to.eq("edit");
    expect(pv.cursor_code.infod).to.eq("tag/rel:icon (15)");
    expect(pv.cursor_code.edit_key).to.eq("value");
    expect(pv.cursor_pos).to.eq(0);
  });

  it("view", async () => {
    ev.set_mode_view();
    expect(ev.mode).to.eq("view");
    expect(pv.cursor_code.infod).to.eq("tag/rel:icon (15)");
    expect(pv.cursor_pos).to.eq(0);
  });

  it("rename", async () => {
    ev.set_mode_edit(false);
    expect(ev.mode).to.eq("edit");
    expect(pv.cursor_code.infod).to.eq("tag/rel:rel (15)");
    expect(pv.cursor_code.edit_key).to.eq("key");
    expect(pv.cursor_pos).to.eq(0);
  });

  it("view", async () => {
    ev.set_mode_view();
    expect(ev.mode).to.eq("view");
    expect(pv.cursor_code.infod).to.eq("tag/rel:icon (15)");
    expect(pv.cursor_pos).to.eq(0);
  });

  it("go to comment(3) ", async () => {
    ev.down(3);
    expect(pv.cursor_code.info).to.eq("comment/ <link rel (19)");
  });

  it("Replace", async () => {
    ev.replace();
    expect(ev.mode).to.eq("rename");
    expect(ev.allowed_list.length).to.eq(4);
    expect(ev.allowed_function).to.not.eq(undefined);

    ev.allowed_select(ev.allowed_list[0]); //<-we add cursror code
    expect(ev.mode).to.eq("edit");
    expect(pv.cursor_code.info).to.eq("tag/comment (29)");
    expect(pv.cursor_code.codes.length).to.eq(1);
    expect(pv.cursor_code.codes[0].info).to.eq("comment/ <link rel (30)");
  });
});

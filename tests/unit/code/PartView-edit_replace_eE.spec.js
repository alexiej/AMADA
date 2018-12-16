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
    ev.down(6);
    ev.next();
    expect(pv.cursor.info).to.eq("rel='icon'/13");
  });

  it("edit", async () => {
    ev.mode_set_edit();
    expect(ev.mode).to.eq("edit");
    expect(pv.cursor.info).to.eq("rel='icon'/13");
    expect(pv.edit_id).to.eq("1/13/val"); //part_view.id + '/' + cursor.id + key,val
    expect(pv.cursor_pos).to.eq(0);
  });

  it("view", async () => {
    ev.mode_set_view();
    expect(ev.mode).to.eq("view");
    expect(pv.cursor.info).to.eq("rel='icon'/13");
    expect(pv.cursor_pos).to.eq(0);
  });

  it("rename", async () => {
    ev.mode_set_edit(false);
    expect(ev.mode).to.eq("edit");
    expect(pv.cursor.info).to.eq("rel='icon'/13");
    expect(pv.edit_id).to.eq("1/13/key"); //part_view.id + '/' + cursor.id + key,val
    expect(pv.cursor_pos).to.eq(0);
  });

  it("view", async () => {
    ev.mode_set_view();
    expect(ev.mode).to.eq("view");
    expect(pv.cursor.info).to.eq("rel='icon'/13");
    expect(pv.cursor_pos).to.eq(0);
  });

  it("go to comment(3) ", async () => {
    ev.down(2);
    expect(pv.cursor.info).to.eq("comment: <link rel/17");
  });

  it("Replace", async () => {
    ev.view_replace();
    expect(ev.mode).to.eq("replace");
    expect(ev.allowed_list.length).to.eq(4);
    expect(ev.allowed_function).to.not.eq(undefined);

    ev.allowed_select(ev.allowed_list[0]); //<-we add cursror code
    expect(ev.mode).to.eq("edit");
    expect(pv.cursor.info).to.eq("tag:comment/27");
    expect(pv.cursor.codes.length).to.eq(1);
    expect(pv.cursor.codes[0].info).to.eq("comment: <link rel/17");
    expect(pv.cursor.codes[0].parent.info).to.eq("tag:comment/27");
  });
});

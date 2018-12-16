import { expect } from "chai";
import { shallowMount } from "@vue/test-utils";

import EditorView from "../../../src/amada/views/EditorView";
// import HelloWorld from "@/components/HelloWorld.vue";
import { json, jsone, key } from "../helpers";
import amada from "../mock";

var finish = false;
let path = "../test/index.html";
let file = undefined;
let ev = undefined;
let pv = undefined;

describe("ParView - edit_text_del_back.spec", () => {
  it("Load", async () => {
    file = await amada.file_get(path);
    expect(await json(file)).to.eq(await jsone(file, path));
  });
  it("Load Editor", async () => {
    ev = new EditorView(amada, "id", file);
    pv = ev.part_view;
    ev.up(100);
    ev.down(1);
    // expect(await json(ev)).to.eq(await jsone(ev, "../test/editor_view_01"));
    expect(pv.cursor.info).to.eq("html:html (lang='en'/2,)/1");
  });
  it("go edit - comment", async () => {
    ev.down(9);
    ev.mode_set_edit();
    expect(pv.cursor.info).to.eq("comment:A/19"); //we are in the comments
    expect(ev.mode).to.eq("edit");
  });

  it("text operations", async () => {
    // console.log(key("^a"));
    // ev.down(10);
    ev.key(key("a"));
    let cc = pv.cursor;

    // console.log(cc.edit_text);
    expect(cc.val).to.eq("aA");
    expect(pv.cursor_text).to.eq("aA");
    expect(cc.info).to.eq("comment:aA/19"); //we are in the comments

    ev.key(key("Backspace"));
    expect(cc.val).to.eq("A");
    expect(pv.cursor_text).to.eq("A");
    expect(pv.cursor_pos).to.eq(0);

    ev.key(key("Delete"));
    expect(cc.val).to.eq("");
    expect(pv.cursor_text).to.eq("");

    ev.key(key("Enter"));
    expect(cc.val).to.eq("\n");
    expect(pv.cursor_text).to.eq("\n");
  });
  it("text operations", async () => {});
});

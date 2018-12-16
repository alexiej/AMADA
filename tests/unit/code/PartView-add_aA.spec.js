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

describe("ParView-add_aA.spec.js", () => {
  it("go edit - comment", async () => {
    file = await amada.file_get(path);
    ev = new EditorView(amada, "id", file);
    pv = ev.part_view;
    ev.down(9);

    expect(pv.cursor.info).to.eq("comment: <script s/18");
  });
  it("Set mode allowed", async () => {
    ev.view_add_after();
    expect(ev.view_code.info).to.eq("comment: <script s/18");
    expect(ev.allowed_list.length).to.eq(4);
    expect(ev.allowed_function).to.not.eq(undefined);

    expect(ev.view_code.parent.codes.length).to.eq(8);

    ev.allowed_select(ev.allowed_list[0]);
    expect(ev.mode).to.eq("edit");
    ev.mode_set_view();
    expect(ev.mode).to.eq("view");
  });
  it("add element after", async () => {
    //<-we add cursror code
    let c = pv.cursor;
    expect(c.info).to.eq("tag:_name_/27");
    expect(c.parent.info).to.eq("head:head/3");

    expect(pv.cursor.parent.codes.length).to.eq(9);
    expect(pv.cursor.parent.codes.indexOf(c)).to.eq(7);

    expect(pv.cursor.parent.codes[6].info).to.eq("comment: <script s/18");
    expect(pv.cursor.parent.codes[8].info).to.eq("comment:A/19");
  }),
    it("add elemetn before - allowed ", async () => {
      ev.view_add_after();
      expect(ev.view_code.info).to.eq("tag:_name_/27");
      expect(ev.allowed_list.length).to.eq(4);
      expect(ev.allowed_function).to.not.eq(undefined);

      expect(ev.view_code.parent.codes.length).to.eq(9);

      ev.allowed_select(ev.allowed_list[0]);
      expect(ev.mode).to.eq("edit");
      ev.mode_set_view();
      expect(ev.mode).to.eq("view");
    }),
    it("add element before", async () => {
      let c = pv.cursor;
      expect(c.info).to.eq("tag:_name_/28");
      expect(c.parent.info).to.eq("head:head/3");

      expect(pv.cursor.parent.codes.length).to.eq(10);
      expect(pv.cursor.parent.codes.indexOf(c)).to.eq(8);

      expect(pv.cursor.parent.codes[7].info).to.eq("tag:_name_/27");
      expect(pv.cursor.parent.codes[9].info).to.eq("comment:A/19");
    });
  it("add property before", async () => {
    ev.up(5);
    ev.next(1);
    expect(pv.cursor.parent.properties.length).to.eq(2);
    expect(pv.cursor.info).to.eq("rel='icon'/13");
    ev.view_add_before();
    expect(ev.mode).to.eq("edit");
    ev.mode_set_view();

    expect(ev.mode).to.eq("view");
    expect(pv.cursor.info).to.eq("name=''/29");
    expect(pv.cursor.parent.properties.length).to.eq(3);
  });
  it("add property after", async () => {
    ev.view_add_after();
    expect(ev.mode).to.eq("edit");
    ev.mode_set_view();
    expect(ev.mode).to.eq("view");
    expect(pv.cursor.info).to.eq("name=''/30");
    expect(pv.cursor.parent.properties.length).to.eq(4);
  });
});

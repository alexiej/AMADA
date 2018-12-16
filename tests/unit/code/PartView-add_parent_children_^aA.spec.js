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
    ev.view_add_children();
    expect(ev.view_code.info).to.eq("comment: <script s/18");
    expect(ev.allowed_list.length).to.eq(13);
    expect(ev.allowed_function).to.not.eq(undefined);

    expect(ev.view_code.parent.codes.length).to.eq(8);

    ev.allowed_select(ev.allowed_list[0]);
    expect(ev.mode).to.eq("edit");
    ev.mode_set_view();
    expect(ev.mode).to.eq("view");
  });

  it("add children", async () => {
    //<-we add cursror code
    let c = pv.cursor;
    expect(c.info).to.eq("html:_name_/27");
    expect(c.parent.info).to.eq("comment: <script s/18");
    expect(pv.cursor.parent.codes.length).to.eq(1);
    expect(pv.cursor.parent.codes.indexOf(c)).to.eq(0);
  });

  it("Set mode parent", async () => {
    ev.view_add_parent();
    expect(ev.view_code.info).to.eq("html:_name_/27");
    expect(ev.allowed_list.length).to.eq(13);
    expect(ev.allowed_function).to.not.eq(undefined);

    ev.allowed_select(ev.allowed_list[0]);
    expect(ev.mode).to.eq("edit");
    ev.mode_set_view();
    expect(ev.mode).to.eq("view");
  });

  it("add parent", async () => {
    //<-we add cursror code
    let c = pv.cursor;
    expect(c.info).to.eq("html:_name_/28");
    expect(c.parent.info).to.eq("comment: <script s/18");
    expect(pv.cursor.parent.codes.length).to.eq(1);
    expect(pv.cursor.parent.codes.indexOf(c)).to.eq(0);
    expect(pv.cursor.codes.length).to.eq(1);
    expect(pv.cursor.codes[0].info).to.eq("html:_name_/27");
  });

  it("add property parent", async () => {
    ev.up(4);
    ev.next(1);
    //<-we add cursror code
    let c = pv.cursor;
    expect(c.info).to.eq("rel='icon'/13");
    ev.view_add_parent();
    expect(ev.mode).to.eq("edit");
    ev.mode_set_view();
    expect(ev.mode).to.eq("view");

    expect(c.parent.info).to.eq(
      "tag:link (name=''/29,rel='icon'/13,href='<%= BASE_URL %>favicon.ico'/14,)/12"
    );
  });

  it("add property parent", async () => {
    //<-we add cursror code
    let c = pv.cursor;
    expect(c.info).to.eq("name=''/29");
    ev.view_add_children();
    expect(ev.mode).to.eq("edit");
    ev.mode_set_view();
    expect(ev.mode).to.eq("view");

    expect(c.parent.info).to.eq(
      "tag:link (name=''/29,name=''/30,rel='icon'/13,href='<%= BASE_URL %>favicon.ico'/14,)/12"
    );
  });

  it("add parent section", async () => {
    ev.up(8);
    expect(pv.cursor.info).to.eq("section-part:HTML/0");

    ev.view_add_parent();
    expect(ev.mode).to.eq("add");
    expect(ev.mode_text).to.eq("children");

    expect(ev.allowed_list.length).to.eq(1);
    expect(ev.allowed_function).to.not.eq(undefined);

    ev.allowed_select(ev.allowed_list[0]);

    ev.mode_set_view();
    expect(ev.mode).to.eq("view");

    let c = pv.cursor;
    expect(c.info).to.eq("html:_name_/31");
    expect(c.parent.info).to.eq("section-part:HTML/0");
    expect(pv.cursor.parent.codes.length).to.eq(2);
    expect(pv.cursor.parent.codes.indexOf(c)).to.eq(1);
    expect(pv.cursor.parent.codes[0].info).to.eq("html:html (lang='en'/2,)/1");
    expect(pv.cursor.parent.codes[1].info).to.eq("html:_name_/31");
    expect(pv.cursor.codes.length).to.eq(0);
  });
});

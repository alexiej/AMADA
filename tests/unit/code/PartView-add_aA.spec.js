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

describe.only("ParView-add_aA.spec.js", () => {
  it("go edit - comment", async () => {
    file = await amada.file_get(path);
    ev = new EditorView(amada, "id", file);
    pv = ev.part_view;
    ev.down(9);

    expect(pv.cursor_code.infoc).to.eq("comment/ <script s (20)[comment/11]");
  });
  it("add element after", async () => {
    let cv = pv.add_after(
      pv.cursor_code,
      ev.schema.models["tag"].create("html")
    );
    expect(cv.infoc).to.eq("tag/html (29)[tag/19]");
    expect(cv.parent.infoc).to.eq("head/head (5)[head/3]");
    expect(cv.parent.code.codes.length).to.eq(9);
    expect(cv.parent.code_views.length).to.eq(9);
    expect(cv.parent.codes.length).to.eq(9);

    expect(cv.next.infoc).to.eq("comment/A (21)[comment/12]");
    expect(cv.prev.infoc).to.eq("comment/ <script s (20)[comment/11]");

    expect(pv.cursor_code.infoc).to.eq("comment/ <script s (20)[comment/11]");
  });
  it("add element before", async () => {
    let cv = pv.add_before(
      pv.cursor_code,
      ev.schema.models["tag"].create("html2")
    );
    expect(cv.infoc).to.eq("tag/html2 (30)[tag/20]");
    expect(cv.parent.infoc).to.eq("head/head (5)[head/3]");
    expect(cv.parent.code.codes.length).to.eq(10);
    expect(cv.parent.code_views.length).to.eq(10);
    expect(cv.parent.codes.length).to.eq(10);

    expect(cv.next.infoc).to.eq("comment/ <script s (20)[comment/11]");
    expect(cv.prev.infoc).to.eq("comment/ <link rel (19)[comment/10]");

    expect(pv.cursor_code.infoc).to.eq("comment/ <script s (20)[comment/11]");
  });
  it("add property after", async () => {
    let cv = pv.add_before(
      pv.cursor_code,
      ev.schema.models["tag"].create("html2")
    );
  
  });
});

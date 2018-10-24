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

describe.only("ParView-insert.spec.js", () => {
  it("go edit - comment", async () => {
    file = await amada.file_get(path);
    ev = new EditorView(amada, "id", file);
    pv = ev.part_view;
    ev.down(undefined, amada, 5);
    expect(pv.cursor_code.model.name).to.eq("tag"); //we are in the comments
  });
  it("add element after", async () => {
    let l = pv.cursor_code.parent.codes.length;
    let prev_cv = pv.cursor_code;

    let parent = prev_cv.parent;

    let lc = parent.codes.indexOf(prev_cv);
    let lv = parent.code_views.indexOf(prev_cv);
    let ls = prev_cv.last_select();
    let lsi = parent.code_views.indexOf(ls);

    // console.log(parent.infod);

    let cv = pv.add_after(prev_cv, ev.schema.models["tag"].create("html"));
    assert.isNotNull(cv);
    expect(cv.code.parent.codes.length).to.eq(l + 1);

    expect(cv.model.name).to.eq("tag");
    expect(cv.edit_text).to.eq("html");

    expect(cv.prev).to.eq(ls);
    expect(ls.next).to.eq(cv);
    expect(cv.parent).to.eq(prev_cv.parent);

    // expect(parent.codes.indexOf(cv)).to.eq(lc + 1);
    // expect(parent.code_views.indexOf(cv)).to.eq(lv + 1);

    // expect(2).to.eq(3);
  });
  it("add new one", async () => {
    expect(2).to.eq(3);
  });
});

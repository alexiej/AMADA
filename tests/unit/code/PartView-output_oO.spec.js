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

describe("PartView-output_oO.spec", () => {
  it("go edit - comment", async () => {
    file = await amada.file_get(path);
    ev = new EditorView(amada, "id", file);
    pv = ev.part_view;
  });

  it("preview", async () => {
    expect(ev.code_preview).to.eq("");

    ev.preview();
    expect(ev.part_view.preview_visible).to.eq(true);
    expect(ev.code_preview).to.not.eq("");

    ev.preview();
    expect(ev.part_view.preview_visible).to.eq(false);
    expect(ev.code_preview).to.not.eq("");
  });
});

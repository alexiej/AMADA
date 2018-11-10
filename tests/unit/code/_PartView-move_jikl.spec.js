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

/***
 * !down (k): down_select
 * !down_item (K): down_item
 * 
 * !up (i): up_select
 * !up_item (i): up_item
 * 
 * !next (l): next_select
 * !next_item (l): next_item
 *  
 * !prev (j): prev_select
 * !prev_item (j): prev_item

 * 
 *  * EditorView: down
 *  * EditorView: __go( FUNCTION )
 *    * CodeView: FUNCTION
 *    * PartView: cursor_code_set
 *      * Component: cursor_to_code
 */

describe("ParView-move.spec.js", () => {
  it("go edit - comment", async () => {
    file = await amada.file_get(path);
    ev = new EditorView(amada, "id", file);
    pv = ev.part_view;
  });

  it("next(3) - html->lang", async () => {
    // console.log(pv.cursor_code.infod);
    expect(pv.cursor_code.info).to.eq("html/html (3)");
    ev.next();
    expect(pv.cursor_code.info).to.eq("html/lang:en (4)");
  });

  it("down() -> head", async () => {
    ev.down();
    expect(pv.cursor_code.info).to.eq("head/head (5)");
  });

  it("down() -> meta", async () => {
    ev.down(2);
    expect(pv.cursor_code.info).to.eq("tag/meta (8)");
  });

  it("next(2) -> tag parameter", async () => {
    ev.next(2);
    expect(pv.cursor_code.info).to.eq("tag/content:IE=edge (10)");
  });

  it("prev() -> tag prev para", async () => {
    ev.prev();
    expect(pv.cursor_code.info).to.eq("tag/http-equiv:X-UA-Compa (9)");
  });

  it("prev() -> tag meta", async () => {
    ev.prev();
    expect(pv.cursor_code.info).to.eq("tag/meta (8)");
  });

  it("prev() -> tag head", async () => {
    ev.prev();
    expect(pv.cursor_code.info).to.eq("head/head (5)");
  });

  it("up() -> tag html", async () => {
    ev.prev();
    expect(pv.cursor_code.info).to.eq("html/html (3)");
  });

  it("down_item() -> tag meta", async () => {
    ev.down(2);
    expect(pv.cursor_code.info).to.eq("tag/meta (6)");

    ev.down_item(8);
    expect(pv.cursor_code.info).to.eq("tag/meta (6)");
  });

  it("up_item() -> tag meta", async () => {
    ev.up_item(8);
    expect(pv.cursor_code.info).to.eq("tag/meta (6)");
  });

  it("next_item() -> tag meta", async () => {
    ev.down();
    ev.next();
    expect(pv.cursor_code.info).to.eq("tag/http-equiv:X-UA-Compa (9)");

    ev.next_item(2);
    expect(pv.cursor_code.info).to.eq("tag/http-equiv:X-UA-Compa (9)");
  });

  it("prev_item() -> tag meta", async () => {
    ev.prev_item(2);
    expect(pv.cursor_code.info).to.eq("tag/http-equiv:X-UA-Compa (9)");
  });
});

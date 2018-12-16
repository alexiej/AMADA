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
  it("go edit - comment ", async () => {
    file = await amada.file_get(path);
    ev = new EditorView(amada, "id", file);
    pv = ev.part_view;
  });

  it("next(3) - html->lang", async () => {
    // console.log(pv.cursor_code.infod);
    expect(pv.cursor.info).to.eq("section-part:HTML/0");
    ev.next();
    expect(pv.cursor.info).to.eq("html:html (lang='en'/2,)/1");
  });

  it("down() -> head", async () => {
    ev.down();
    expect(pv.cursor.info).to.eq("head:head/3");
  });

  it("down() -> meta", async () => {
    ev.down(2);
    expect(pv.cursor.info).to.eq(
      "tag:meta (http-equiv='X-UA-Compatible'/7,content='IE=edge'/8,)/6"
    );
  });

  it("next(2) -> tag parameter", async () => {
    ev.next(2);
    expect(pv.cursor.info).to.eq("content='IE=edge'/8");
  });

  it("prev() -> tag prev para", async () => {
    ev.prev();
    expect(pv.cursor.info).to.eq("http-equiv='X-UA-Compatible'/7");
  });

  it("prev() -> tag meta", async () => {
    ev.prev();
    expect(pv.cursor.info).to.eq(
      "tag:meta (http-equiv='X-UA-Compatible'/7,content='IE=edge'/8,)/6"
    );
  });

  it("prev() -> charset", async () => {
    ev.prev();
    expect(pv.cursor.info).to.eq("charset='utf-8'/5");
  });

  it("up() -> tag html", async () => {
    ev.up(3);
    expect(pv.cursor.info).to.eq("html:html (lang='en'/2,)/1");
  });

  it("down_item() -> tag meta", async () => {
    ev.down(2);
    expect(pv.cursor.info).to.eq("tag:meta (charset='utf-8'/5,)/4");

    ev.down_item(8);
    expect(pv.cursor.info).to.eq("tag:meta (charset='utf-8'/5,)/4");
  });

  it("up_item() -> tag meta", async () => {
    ev.up_item(8);
    expect(pv.cursor.info).to.eq("tag:meta (charset='utf-8'/5,)/4");
  });

  it("next_item() -> tag meta", async () => {
    ev.down();
    ev.next();
    expect(pv.cursor.info).to.eq("http-equiv='X-UA-Compatible'/7");

    ev.next_item(2);
    expect(pv.cursor.info).to.eq("http-equiv='X-UA-Compatible'/7");
  });

  it("prev_item() -> tag meta", async () => {
    ev.prev_item(2);
    expect(pv.cursor.info).to.eq("http-equiv='X-UA-Compatible'/7");
  });

  it("next(false) -> next_cursor false chldren from last item", async () => {
    ev.down(7);
    expect(pv.cursor.info).to.eq("body:body/20");

    pv.cursor_next(false);
    expect(pv.cursor.info).to.eq("section-part:HTML/0");
  });
});

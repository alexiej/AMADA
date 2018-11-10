import { expect } from "chai";
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

import {
  __get_prev_line_pos,
  __get_next_line_pos,
  __get_line_pos
} from "../../../src/amada/views/PartView";

describe("ParView - cursor.spec.js", () => {
  it("__get_prev_line_pos 3", () => {
    expect(__get_prev_line_pos("Very loong tex", 3)).to.eq(0);
    expect(__get_prev_line_pos("Very loong\n AAAA", -1)).to.eq(0);
    expect(__get_prev_line_pos("Very loong\n AAAA", -5)).to.eq(0);
  });

  it("__get_prev_line_pos 13", () => {
    expect(__get_prev_line_pos("Very loong\n AAAA", 13)).to.eq(11);
  });
  it("__get_prev_line_pos 18,10", () => {
    expect(__get_prev_line_pos("Very loong\n AAAA", 18)).to.eq(11);
    expect(__get_prev_line_pos("Very loong\n AAAA", 10)).to.eq(0);
  });

  it("__get_prev_line_pos 3", () => {
    // let text =
    // ' <link rel="stylesheet" href="https://unpkg.com/leaflet@1.\n.3/dist/leaflet.css\n.3/dist/leaf\n Rksm5RenBEKSKFjgI3a41vrjkw4EVPlJ3+OiI65vTjIdo9brlAacEuKOiQ5OFh7cOI1bkDwLqdLw3Zg0cRJAAQ==';
    expect(__get_prev_line_pos("Very loong tex", 3)).to.eq(0);
    expect(__get_prev_line_pos("Very loong\n AAAA", -1)).to.eq(0);
    expect(__get_prev_line_pos("Very loong\n AAAA", -5)).to.eq(0);

    // console.log(__get_prev_line_pos(text, text.length));
  });

  it("__get_next_line_pos 3", () => {
    expect(__get_next_line_pos("Very loong\n AAAA", 3)).to.eq(11);
  });
  it("__get_next_line_pos 13", () => {
    expect(__get_next_line_pos("Very loong\n AAAA", 13)).to.eq(-1);
  });

  it("__get_line_pos line", () => {
    expect(__get_line_pos("Very loong\n AAAA", 0)).to.eq(0);
    expect(__get_line_pos("Very loong\n AAAA", 1)).to.eq(1);
    expect(__get_line_pos("Very loong\n AAAA", 3)).to.eq(3);
    expect(__get_line_pos("Very loong\n AAAA", 10)).to.eq(10);
  });

  it("Load", async () => {
    file = await amada.file_get(path);
    expect(await json(file)).to.eq(await jsone(file, path));
  });
  it("Load Editor", async () => {
    ev = new EditorView(amada, "id", file);
    pv = ev.part_view;
    // expect(await json(ev)).to.eq(await jsone(ev, "../test/editor_view_01"));
    expect(pv.cursor_code.info).to.eq("html/html (3)");
  });
  it("go edit - comment", async () => {
    ev.down(8);
    expect(pv.cursor_code.info).to.eq("comment/ <link rel (19)"); //we are in the comments

    ev.set_mode_edit();
    expect(ev.mode).to.eq("edit"); //we are in the comments

    ev.cursor_next(2);
    expect(pv.cursor_pos).to.eq(2);
    expect(pv.cursor_x).to.eq(2);

    // ev.cursor_next(undefined, amada, 64);
    ev.cursor_down(1);
    expect(pv.cursor_x).to.eq(2);
    expect(pv.cursor_pos).to.eq(62);

    ev.cursor_up(1);

    expect(pv.cursor_pos).to.eq(2); //we are in the comments
    expect(pv.cursor_x).to.eq(2); //we are in the comments
  });
  it("go +1 line/-1 line", async () => {
    ev.cursor_down(1);
    ev.cursor_down(1);

    ev.cursor_up(1);

    expect(pv.cursor_pos).to.eq(62); //we are in the comments
    expect(pv.cursor_x).to.eq(2); //we are in the comments
  });
  it("go  -1 line", async () => {
    ev.cursor_up(1);
    ev.cursor_up(1);

    expect(pv.cursor_pos).to.eq(186); //we are in the comments
    expect(pv.cursor_x).to.eq(2); //we are in the comments
  });
  it("go +1 line/break", async () => {
    ev.cursor_down(1);
    expect(pv.cursor_pos).to.eq(2); //we are in the comments
    expect(pv.cursor_pos).to.eq(pv.cursor_x); //we are in the comments
  });
  it("go pos 26", async () => {
    ev.cursor_go(26);
    expect(pv.cursor_pos).to.eq(26); //we are in the comments
    expect(pv.cursor_x).to.eq(26); //we are in the comments
    ev.cursor_down(1);
    expect(pv.cursor_x).to.eq(20); //we are
    expect(pv.cursor_pos).to.eq(80); //we are in the comments
  });
  it("go down", async () => {
    ev.cursor_down(1);
    expect(pv.cursor_pos).to.eq(93); //we are in the comments

    expect(pv.cursor_x).to.eq(12); //we are
  });
  it("go up", async () => {
    ev.cursor_go(110);
    expect(pv.cursor_pos).to.eq(110); //we are in the comments
    expect(pv.cursor_x).to.eq(16); //we are in the comments

    ev.cursor_up(1);
    expect(pv.cursor_pos).to.eq(93); //we are in the comments

    expect(pv.cursor_x).to.eq(12); //we are
  });
  it("go down 118->cursor_down", async () => {
    console.log(
      "==================================================================="
    );
    ev.cursor_go(118);
    expect(pv.cursor_pos).to.eq(118); //we are in the comments
    expect(pv.cursor_x).to.eq(24); //we are in the comments

    ev.cursor_down(1);
    expect(pv.cursor_pos).to.eq(201); //we are in the comments
    expect(pv.cursor_x).to.eq(17); //we are on the end of the text
  });

  it("go next", async () => {
    ev.cursor_next(1);
    expect(pv.cursor_pos).to.eq(0); //we are in the comments
    expect(pv.cursor_x).to.eq(0); //we are
  });
  it("go 0->prev", async () => {
    ev.cursor_prev(1);
    expect(pv.cursor_pos).to.eq(201); //we are in the comments
    expect(pv.cursor_x).to.eq(17); //we are
  });
  it("go down/2", async () => {
    ev.cursor_go(21);
    expect(pv.cursor_pos).to.eq(21); //we are in the comments
    expect(pv.cursor_x).to.eq(21); //we are in the comments

    ev.cursor_down(1);
    expect(pv.cursor_pos).to.eq(80); //we are in the comments
    expect(pv.cursor_x).to.eq(20); //we are
  });

  it("go begin line", async () => {
    ev.cursor_go(6);
    expect(pv.cursor_pos).to.eq(6); //we are in the comments
    expect(pv.cursor_x).to.eq(6); //we are in the comments

    ev.cursor_first_in_line();
    expect(pv.cursor_pos).to.eq(0); //we are in the comments
    expect(pv.cursor_x).to.eq(0); //we are

    ev.cursor_last_in_line();
    expect(pv.cursor_pos).to.eq(59); //we are in the comments
    expect(pv.cursor_x).to.eq(59); //we are

    ev.cursor_go(191);
    expect(pv.cursor_pos).to.eq(191); //we are in the comments
    expect(pv.cursor_x).to.eq(7); //we are in the comments

    ev.cursor_first_in_line();
    expect(pv.cursor_pos).to.eq(184); //we are in the comments
    expect(pv.cursor_x).to.eq(0); //we are

    ev.cursor_last_in_line();
    expect(pv.cursor_pos).to.eq(201); //we are in the comments
    expect(pv.cursor_x).to.eq(17); //we are
  });

  it("go empty line", async () => {
    ev.set_mode_view();
    ev.down(2);
    expect(pv.cursor_code.info).to.eq("comment/A (21)"); //we are in the comments

    ev.set_mode_edit();
  });

  it("go end of line", async () => {
    ev.cursor_last_in_line();
    expect(pv.cursor_code.info).to.eq("comment/A (21)"); //we are in the comments
    expect(pv.cursor_pos).to.eq(1); //we are in the comments
  });
});

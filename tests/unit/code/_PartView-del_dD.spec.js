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

describe("ParView-delete_dD.spec.js", () => {
  it("go edit - comment", async () => {
    file = await amada.file_get(path);
    ev = new EditorView(amada, "id", file);
    pv = ev.part_view;
    ev.down(8);

    expect(pv.cursor_code.infod).to.eq("comment/ <link rel (19)[comment/10]");
  });

  it("deleete comment", async () => {
    expect(pv.cursor_code.parent.code.codes.length).to.eq(8);

    ev.delete(false);
    const comment = "comment/ <script s (20)[comment/11]";
    // console.log(pv.cursor_code.infoc, comment);
    expect(pv.cursor_code.infoc).to.eq(comment);
    expect(pv.cursor_code.prev.infoc).to.eq("line tag/title (17)[line tag/8]");
    expect(pv.cursor_code.next.infoc).to.eq("comment/A (21)[comment/12]");

    expect(pv.cursor_code.next.prev.infoc).to.eq(comment);
    expect(pv.cursor_code.prev.next.infoc).to.eq(comment);

    expect(pv.cursor_code.parent.infoc).to.eq("head/head (5)[head/3]");
    expect(pv.cursor_code.parent.codes.length).to.eq(7);
    expect(pv.cursor_code.parent.code_views.length).to.eq(7);

    expect(pv.cursor_code.parent.code.codes.length).to.eq(7);
  });

  it("deleete script", async () => {
    ev.down(4);
    expect(pv.cursor_code.infoc).to.eq("tag/strong (24)[tag/15]");
    // console.log(pv.cursor_code.infoc);

    ev.delete(false);
    const tag = "line/We're sorr (25)[line/16]";
    const prev = "";
    const next = "";
    const parent = "tag/noscript (23)[tag/14]";
    expect(pv.cursor_code.infoc).to.eq(tag);

    expect(pv.cursor_code.parent.infoc).to.eq(parent);
    expect(pv.cursor_code.parent.codes.length).to.eq(1);
    expect(pv.cursor_code.parent.code.codes.length).to.eq(1);
    expect(pv.cursor_code.parent.code_views.length).to.eq(1);

    expect(pv.cursor_code.prev).to.eq(undefined);
    expect(pv.cursor_code.next).to.eq(undefined);
  });

  it("deleete body", async () => {
    ev.up(2);
    expect(pv.cursor_code.infoc).to.eq("body/body (22)[body/13]");

    ev.delete(true);
    const tag = "html/html (3)[html (lang:en,)/2]";
    expect(pv.cursor_code.infoc).to.eq(tag);
    expect(pv.cursor_code.parent.code.codes.length).to.eq(1);
    expect(pv.cursor_code.parent.codes.length).to.eq(1);
    expect(pv.cursor_code.parent.code_views.length).to.eq(1);
  });

  it("deleete head", async () => {
    ev.down(1);
    expect(pv.cursor_code.infoc).to.eq("head/head (5)[head/3]");

    ev.delete(false);

    const tag = "tag/meta (6)[tag (charset:utf-8,)/4]";
    const prev = "html/lang:en (4)[html (lang:en,)/2]";
    const next =
      "tag/meta (8)[tag (http-equiv:X-UA-Compatible,content:IE=edge,)/5]";
    const parent = "html/html (3)[html (lang:en,)/2]";
    expect(pv.cursor_code.infoc).to.eq(tag);

    expect(pv.cursor_code.parent.infoc).to.eq(parent);
    expect(pv.cursor_code.parent.code.codes.length).to.eq(7);
    expect(pv.cursor_code.parent.codes.length).to.eq(7);

    expect(pv.cursor_code.parent.code_views.length).to.eq(8);

    expect(pv.cursor_code.prev.infoc).to.eq(prev);
    expect(pv.cursor_code.next.infoc).to.eq(next);
  });

  it("deleete section-part", async () => {
    ev.up(2);

    expect(pv.cursor_code.infoc).to.eq("section-part/ (2)[section-part/0]");
    ev.delete(false);
    expect(pv.cursor_code.infoc).to.eq("section-part/ (2)[section-part/0]");
  });

  it("deleete html", async () => {
    ev.down(1);
    expect(pv.cursor_code.infoc).to.eq("html/html (3)[html (lang:en,)/2]");
    ev.delete(false);
    expect(pv.cursor_code.infoc).to.eq("tag/meta (6)[tag (charset:utf-8,)/4]");

    const tag = "tag/meta (6)[tag (charset:utf-8,)/4]";
    const parent = "section-part/ (2)[section-part/0]";

    expect(pv.cursor_code.infoc).to.eq(tag);
    expect(pv.cursor_code.parent.infoc).to.eq(parent);
    expect(pv.cursor_code.parent.code.codes.length).to.eq(7);

    expect(pv.cursor_code.parent.codes.length).to.eq(7);
    expect(pv.cursor_code.parent.code_views.length).to.eq(7);

    const next =
      "tag/meta (8)[tag (http-equiv:X-UA-Compatible,content:IE=edge,)/5]";
    expect(pv.cursor_code.prev).to.eq(undefined);
    expect(pv.cursor_code.next.infoc).to.eq(next);
  });

  it("deleete meta", async () => {
    ev.delete(false);

    const tag =
      "tag/meta (8)[tag (http-equiv:X-UA-Compatible,content:IE=edge,)/5]";
    const parent = "section-part/ (2)[section-part/0]";

    expect(pv.cursor_code.infoc).to.eq(tag);
    expect(pv.cursor_code.parent.infoc).to.eq(parent);
  });

  it("deleete property", async () => {
    ev.next();

    expect(pv.cursor_code.parent.props.length).to.eq(2);
    ev.delete(false);

    const tag = "tag/content:IE=edge (10)[tag (content:IE=edge,)/5]";
    const parent = "tag/meta (8)[tag (content:IE=edge,)/5]";

    expect(pv.cursor_code.infoc).to.eq(tag);
    expect(pv.cursor_code.code.properties.length).to.eq(1);
    expect(pv.cursor_code.parent.infoc).to.eq(parent);

    expect(pv.cursor_code.parent.props.length).to.eq(1);

    expect(pv.cursor_code.next).to.eq(undefined);
    expect(pv.cursor_code.prev).to.eq(undefined);
  });

  it("new file", async () => {
    amada.reset_id(); //<reset counter to 0;

    file = await amada.file_get(path);
    ev = new EditorView(amada, "id", file);
    pv = ev.part_view;
    ev.down(8);
    expect(pv.cursor_code.infoc).to.eq("comment/ <link rel (19)[comment/10]");

    //comment/ <link rel (19)
    ev.delete(true);
    expect(pv.cursor_code.infoc).to.eq("comment/ <script s (20)[comment/11]");

    //tag/rel:icon (15)
    ev.prev_item(2);
    ev.next();
    expect(pv.cursor_code.infoc).to.eq(
      "tag/rel:icon (15)[tag (rel:icon,href:<%= BASE_URL %>favicon.ico,)/7]"
    );
    ev.delete(true);
    expect(pv.cursor_code.infoc).to.eq(
      "tag/href:<%= BASE_U (16)[tag (href:<%= BASE_URL %>favicon.ico,)/7]"
    );

    //tag/link (14)
    ev.prev();
    expect(pv.cursor_code.infoc).to.eq(
      "tag/link (14)[tag (href:<%= BASE_URL %>favicon.ico,)/7]"
    );
    ev.delete(true);
    expect(pv.cursor_code.infoc).to.eq("line tag/title (17)[line tag/8]");

    //tag/content:width=devi (13)
    ev.up(1);
    ev.next(2);
    expect(pv.cursor_code.infoc).to.eq(
      "tag/content:width=devi (13)[tag (name:viewport,content:width=device-width,initial-scale=1.0,)/6]"
    );
    ev.delete(true);
    expect(pv.cursor_code.infoc).to.eq(
      "tag/name:viewport (12)[tag (name:viewport,)/6]"
    );

    //tag/name:viewport (12)
    ev.delete(true);
    expect(pv.cursor_code.infoc).to.eq("tag/meta (11)[tag/6]");

    //tag/meta (11)
    ev.delete(true);
    expect(pv.cursor_code.infoc).to.eq("line tag/title (17)[line tag/8]");

    //tag/content:IE=edge (10)
    ev.up();
    ev.next(2);
    expect(pv.cursor_code.infoc).to.eq(
      "tag/content:IE=edge (10)[tag (http-equiv:X-UA-Compatible,content:IE=edge,)/5]"
    );
    ev.delete(true);
    expect(pv.cursor_code.infoc).to.eq(
      "tag/http-equiv:X-UA-Compa (9)[tag (http-equiv:X-UA-Compatible,)/5]"
    );

    //tag/http-equiv:X-UA-Compa (9)
    ev.delete(true);
    expect(pv.cursor_code.infoc).to.eq("tag/meta (8)[tag/5]");

    // console.log(pv.cursor_code.parent.infod);
    expect(pv.cursor_code.parent.infod).to.eq(
      "head/head (5)[head/3]\n tag/meta (6)[tag (charset:utf-8,)/4]\n  tag/charset:utf-8 (7)[tag (charset:utf-8,)/4]\n tag/meta (8)[tag/5]\n line tag/title (17)[line tag/8]\n  content/tensorjs (18)[content/9]\n comment/ <script s (20)[comment/11]\n comment/A (21)[comment/12]"
    );
  });
});

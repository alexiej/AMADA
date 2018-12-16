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

describe.only("ParView-delete_dD.spec.js", () => {
  it("go edit - comment", async () => {
    file = await amada.file_get(path);
    ev = new EditorView(amada, "id", file);
    pv = ev.part_view;
    ev.down(8);

    expect(pv.cursor.infod).to.eq("comment: <link rel/17");
  });

  it("deleete comment", async () => {
    expect(pv.cursor.parent.codes.length).to.eq(8);

    ev.view_delete(false);
    const comment = "comment: <script s/18";
    // console.log(pv.cursor.info, comment);
    expect(pv.cursor.info).to.eq(comment);

    expect(pv.cursor.parent.info).to.eq("head:head/3");
    expect(pv.cursor.parent.codes.length).to.eq(7);
  });

  it("deleete script", async () => {
    ev.down(4);
    expect(pv.cursor.info).to.eq("tag:strong/22");
    // console.log(pv.cursor.info);

    ev.view_delete(false);
    const tag = "line:We're sorr/23";
    const parent = "tag:noscript/21";
    expect(pv.cursor.info).to.eq(tag);

    expect(pv.cursor.parent.info).to.eq(parent);
    expect(pv.cursor.parent.codes.length).to.eq(1);
  });

  it("deleete body", async () => {
    ev.up(2);
    expect(pv.cursor.info).to.eq("body:body/20");

    ev.view_delete(true);

    expect(pv.cursor.info).to.eq("section-part:HTML/0");
    ev.down(1);
    expect(pv.cursor.info).to.eq("html:html (lang='en'/2,)/1");

    expect(pv.cursor.codes.length).to.eq(1);
  });

  it("deleete head", async () => {
    ev.down(1);
    expect(pv.cursor.info).to.eq("head:head/3");

    ev.view_delete(false);

    // const tag = "tag/meta (6)[tag (charset:utf-8,)/4]";
    // const prev = "html/lang:en (4)[html (lang:en,)/2]";
    // const next =
    //   "tag/meta (8)[tag (http-equiv:X-UA-Compatible,content:IE=edge,)/5]";
    // const parent = "html/html (3)[html (lang:en,)/2]";
    expect(pv.cursor.info).to.eq("tag:meta (charset='utf-8'/5,)/4");

    expect(pv.cursor.parent.info).to.eq("html:html (lang='en'/2,)/1");
    expect(pv.cursor.parent.codes.length).to.eq(7);
  });

  it("deleete section-part", async () => {
    ev.up(2);

    expect(pv.cursor.info).to.eq("section-part:HTML/0");
    ev.view_delete(false);
    expect(pv.cursor.info).to.eq("section-part:HTML/0");
  });

  it("deleete html", async () => {
    ev.down(1);
    expect(pv.cursor.info).to.eq("html:html (lang='en'/2,)/1");
    ev.view_delete(false);
    expect(pv.cursor.info).to.eq("tag:meta (charset='utf-8'/5,)/4");

    expect(pv.cursor.parent.info).to.eq("section-part:HTML/0");
    expect(pv.cursor.parent.codes.length).to.eq(7);
  });

  it("deleete meta", async () => {
    ev.view_delete(false);

    expect(pv.cursor.info).to.eq(
      "tag:meta (http-equiv='X-UA-Compatible'/7,content='IE=edge'/8,)/6"
    );
    expect(pv.cursor.parent.info).to.eq("section-part:HTML/0");
  });

  it("deleete property", async () => {
    ev.next();

    expect(pv.cursor.code.properties.length).to.eq(2);
    ev.view_delete(false);

    expect(pv.cursor.info).to.eq("content='IE=edge'/8");
    expect(pv.cursor.code.properties.length).to.eq(1);
    expect(pv.cursor.parent.info).to.eq("tag:meta (content='IE=edge'/8,)/6");

    expect(pv.cursor.parent.properties.length).to.eq(1);
  });

  it("new file", async () => {
    amada.reset_id(); //<reset counter to 0;

    file = await amada.file_get(path);
    ev = new EditorView(amada, "id", file);
    pv = ev.part_view;
    ev.down(8);
    expect(pv.cursor.info).to.eq("comment: <link rel/17");

    //comment/ <link rel (19)
    ev.view_delete(true);
    expect(pv.cursor.info).to.eq("comment: <script s/18");

    //tag/rel:icon (15)
    ev.up(2);
    ev.next();
    expect(pv.cursor.info).to.eq("rel='icon'/13");
    ev.view_delete(true);
    expect(pv.cursor.info).to.eq("href='<%= BASE_URL %>favicon.ico'/14");

    //tag/link (14)
    ev.prev();
    expect(pv.cursor.info).to.eq(
      "tag:link (href='<%= BASE_URL %>favicon.ico'/14,)/12"
    );
    ev.view_delete(true);
    expect(pv.cursor.info).to.eq("line tag:title/15");

    //tag/content:width=devi (13)
    ev.up(1);
    ev.next(2);
    expect(pv.cursor.info).to.eq(
      "content='width=device-width,initial-scale=1.0'/11"
    );
    ev.view_delete(true);
    expect(pv.cursor.info).to.eq("line tag:title/15");

    //tag/name:viewport (12)
    ev.up(1);
    ev.next(1);
    expect(pv.cursor.info).to.eq("name='viewport'/10");
    ev.view_delete(true);
    // expect(pv.cursor.info).to.eq("comment: <script s/18");

    //tag/meta (11)
    ev.up(1);
    expect(pv.cursor.info).to.eq("tag:meta/9");
    ev.view_delete(true);
    expect(pv.cursor.info).to.eq("line tag:title/15");

    //tag/content:IE=edge (10)
    ev.up();
    ev.next(2);
    expect(pv.cursor.info).to.eq("content='IE=edge'/8");
    ev.view_delete(true);
    expect(pv.cursor.info).to.eq("line tag:title/15");
    ev.up();
    ev.next(1);

    expect(pv.cursor.info).to.eq("http-equiv='X-UA-Compatible'/7");
    //tag/http-equiv:X-UA-Compa (9)
    ev.view_delete(true);
    expect(pv.cursor.info).to.eq("line tag:title/15");

    // console.log(pv.cursor.parent.infod);
    expect(pv.cursor.parent.infod).to.eq(
      "head:head/3\n  tag:meta (charset='utf-8'/5,)/4\n  tag:meta/6\n  line tag:title/15\n    content:tensorjs/16\n  comment: <script s/18\n  comment:A/19"
    );
  });
});

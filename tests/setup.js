require("jsdom-global")();
global.expect = require("expect");
window.Date = Date; // temporary bug fix, should be removed after vue-test-utils fixes #936

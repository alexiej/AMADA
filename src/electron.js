/**
 * Couple example files for the electron
 *
 */

const { BrowserWindow } = require("electron").remote;
export const electron = require("electron");

const con = require("electron").remote.getGlobal("console");
const app = require("electron").remote.app;

export function toggleDev() {
  BrowserWindow.getAllWindows()[0].toggleDevTools();
}

export function get_app_folder() {
  // const remote = require("remote");
  if (is_dev()) {
    return process.cwd() + "\\";
  } else {
    return app.getAppPath();
  }
}

export function is_dev() {
  return process.env.NODE_ENV == "development";
  // return process.mainModule.filename.indexOf("app.asar") === -1;
}

// we should avoid any electron
// log on real console
export function logm(...message) {
  con.log(message);
}

export function addEventListener(event, fun) {
  // we need remove event after
  window.addEventListener(event, fun);
  window.addEventListener("beforeunload", () => {
    this.window().removeListener(event, fun);
  });
}

export function window() {
  return BrowserWindow.getAllWindows()[0];
}

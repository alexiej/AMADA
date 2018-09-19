import { isEmpty } from "./__helpers.js";
import File from "./File";

export default class Project {
  constructor() {
    this.files = [];
    this.path = ""; //current working path
    this.file_empty = new File(this);
    this.file = this.file_empty;
    this.files = {};
  }

  file_add(file) {
    this.files[file.path] = file;
  }

  file_set(file) {
    this.file_add(file);
    this.file = file;
  }

  toString() {
    return isEmpty(this.path) ? "<EMPTY>" : this.path;
  }
}

import { get_dir, get_ext } from "./__helpers";

/**
 * File is connected with the main view that is connected in the list.
 */
export default class File {
  constructor(project, path = undefined) {
    this.project = project;
    if (path && path != "") {
      var path_info = get_dir(path);
      var file_info = get_ext(path_info.name);

      this.path = path;
      this.directory = path_info.directory;
      this.name = path_info.name;
      this.file_name = file_info.name;
      this.file_ext = file_info.ext;
    } else {
      this.path = "EMPTY";
      this.directory = "";
      this.name = "EMPTY";
      this.file_name = "";
      this.file_ext = "";
    }
    this.schema = "";
    this.view = undefined;
    this.parts = [];
  }

  assign(schema) {
    Object.assign(this, schema);
  }

  toString() {
    return this.path;
  }

  toJSON() {
    return {
      name: this.name,
      file_name: this.file_name,
      file_ext: this.file_ext,
      schema: this.schema.id,
      parts: this.parts
    };
  }
}

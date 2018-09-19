import File from "../code/File";
const jetpack = require("fs-jetpack");
var fs = require("fs");

export const file = {
  file_get: async function(path) {
    var f = new File(this.project, path);
    var fa = path + ".amada";

    if (fs.existsSync(fa)) {
      fa = JSON.parse(jetpack.read(fa));
      f.schema = await jetpack.read(path);
    } else {
      await this.structure_create(f);
    }
    return f;
  },

  structure_create: async function(file) {
    if (file.file_ext in this.schemas) {
      file.schema = this.schemas[file.file_ext];
    } else {
      file.schema = this.schemas["mock"];
    }
    file.parts = await file.schema.parts_decode(file);
  }
};

var fs = require("fs");

export function __isempty(text) {
  return text == undefined || text == "";
}

export function assign_parent(parent, children) {
  for (let c of children) {
    c.parent = parent;
  }
  return children;
}

// export function logjson()

export function file_read(path, opts = "utf8") {
  return new Promise((res, rej) => {
    fs.readFile(path, opts, (err, data) => {
      if (err) rej(err);
      else res(data);
    });
  });
}

export function file_write(path, data, opts = "utf8") {
  return new Promise((res, rej) => {
    fs.writeFile(path, data, opts, err => {
      if (err) rej(err);
      else res();
    });
  });
}

String.prototype.replaceAll = function(search, replacement) {
  var target = this;
  return target.split(search).join(replacement);
};

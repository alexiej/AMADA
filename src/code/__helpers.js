export function get_dir(path) {
  let last = Math.max(path.lastIndexOf("/"), path.lastIndexOf("\\"));

  return {
    directory: path.substring(0, last),
    name: path.substring(last + 1)
  };
}

export function get_ext(path) {
  let last = path.lastIndexOf(".");

  return {
    name: path.substring(0, last),
    ext: path.substring(last + 1)
  };
}

export function insertArrayAt(array, index, arrayToInsert) {
  Array.prototype.splice.apply(array, [index, 0].concat(arrayToInsert));
}

export function is_whitespace(text) {
  return text == "" || text == undefined || text.trim().length == 0;
}

export function isEmpty(str) {
  return !str || str === "";
}

export function filterByKeys(obj, keys) {
  var result = [];
  for (let k of keys) {
    if (k in obj) {
      result.push(obj[k]);
    }
  }

  return result;
}

export function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

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

export function is_whitespace(text) {
  return text == "" || text == undefined || text.trim().length == 0;
}

export function isEmpty(str) {
  return !str || str === "";
}

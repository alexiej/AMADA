const jetpack = require("fs-jetpack");
var fs = require("fs");

export async function jsone(obj, path) {
  try {
    let json_real = JSON.stringify(obj);
    // console.log(json);
    let path_exp = path + "_exp.json";
    let path_real = path + "_real.json";
    await jetpack.write(path_real, json_real);

    let json_exp = await jetpack.read(path_exp);

    return json_exp;
  } catch (err) {
    // expect(err).to.eq(false);
  }
}

export async function json(obj) {
  return JSON.stringify(obj);
}

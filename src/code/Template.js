import {
  CodeView,
  VIEW_SECTION,
  VIEW_VALUE,
  VIEW_PROPERTY,
  VIEW_LINE,
  VIEW_GROUP,
  SOURCE_TEXT,
  SOURCE_VAL
} from "../amada/views/CodeView";

export const TEMPLATE_SECTION = -2;
export const TEMPLATE_LINE = -1;
export const TEMPLATE_INLINE = 1;
export const TEMPLATE_GROUP = 2;

function emptyif(text) {
  if (text === undefined || text == "" || text.trim() == "") return "";
  return text;
}

function __set_key_value(property) {
  property.prefix = emptyif(property.prefix);
  property.suffix = emptyif(property.suffix);
  property.between = emptyif(property.between);
  property.list_div = emptyif(property.list_div);

  property.display_key = emptyif(property.display_key).trim();
  property.display_val = emptyif(property.display_val).trim();

  return property;
}

/**
 * This is a class of the view of the model.
 * Header, footer and properties
 */
export class Template {
  constructor({
    component_class = "",
    view_type = VIEW_SECTION,
    // is_select, // <- can be select only for, is view selectible ?
    is_visble = true, //<
    is_select = true, //true - mean that whole view can be select
    //<- -1 not selectible
    header = {
      is_visible: true,
      prefix: "",
      display_val: "value",

      suffix: " {"
    },
    footer = {
      is_visible: true,
      prefix: "}",
      suffix: ""
    },
    properties = {
      is_visible: true,
      prefix: "(",
      suffix: ")"
    },

    property = {
      is_visible: true,
      prefix: "",

      list_div: ",",
      between: "='",
      suffix: "'",
      display_key: "key",
      display_val: "value"
    },

    component_name = "amada-code"
  }) {
    this.component_name = component_name;
    this.component_class = component_class;
    this.view_type = view_type;
    this.is_visble = is_visble;
    this.is_select = is_select; //<-what element should I Select

    this.header = __set_key_value(header);
    this.footer = __set_key_value(footer);
    this.properties = __set_key_value(properties);
    this.property = __set_key_value(property);
  }

  get is_block() {
    return this.type < 0;
  }

  // get is_whole_select() {
  //   return (
  //     this.type == TEMPLATE_SECTION ||
  //     this.type == TEMPLATE_GROUP ||
  //     this.type == TEMPLATE_LINE
  //   );
  // }

  get is_section() {
    return this.type_type == VIEW_SECTION;
  }

  get has_header() {
    return this.header.is_visible;
  }

  get has_property() {
    return this.properties.is_visible;
  }

  get has_footer() {
    return this.footer.is_visible;
  }

  /**
   * get view of the code
   */
  get_view(code, part_view) {
    let main = new CodeView({
      id: part_view.get_id(),
      part_view: part_view,
      code: code,
      value: code,
      template: this,
      type: this.view_type,

      component_class: this.component_class,
      component_name: this.component_name,
      is_select: this.is_select //<-we only set for a block to select whole section
    });

    if (this.properties.is_visible) {
      for (let p of code.properties) {
        let is_last = code.properties.indexOf(p);
        is_last = is_last == code.properties.length - 1;

        main.add_prop(
          new CodeView({
            id: part_view.get_id(),
            part_view: part_view,
            code: code,
            value: p,
            template: this,
            type: VIEW_PROPERTY,

            component_class: this.component_class + "-property",
            component_name: this.component_name,
            is_select: true //<-we only set for a block to select whole section
          })
        );
      }
    }

    for (let c of code.codes) {
      let v = part_view.schema.template[c.view_id];
      if (v === undefined) {
        continue;
      }
      main.add(v.get_view(c, part_view));
    }

    return main;
  }
}

export class Creator {
  constructor(model_name) {
    this.model_name = model_name;
  }

  create(model, root_value, root_parameters, root_codes) {
    return model.create(this.value);
  }
}

export class CreatorValue extends Creator {
  constructor(model_name) {
    super(model_name);
  }

  create(model, root_value, root_parameters, root_codes) {
    return model.create(root_value);
  }
}

export class CreatorText extends Creator {
  constructor(model_name) {
    super(model_name);
  }

  create(model, root_value, root_parameters, root_codes) {
    return model.create(this.value);
  }
}

export class CreatorFunction extends Creator {
  constructor(model_name, value_function = v => v) {
    super(model_name);
    this.value_function = value_function;
  }
}

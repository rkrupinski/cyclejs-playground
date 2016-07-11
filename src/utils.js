export function deserialize(data$) {
  return data$
      .map(data => JSON.parse(data) || {})
      .map(data => ({ list: [], ...data }));
}

export function serialize(state) {
  return JSON.stringify(state);
}


class PropertyHook {
  constructor(fn) {
    this.fn = fn;
  }

  hook(...args) {
    this.fn.apply(this, args);
  }
}

export function propHook(fn) {
  return new PropertyHook(fn);
}

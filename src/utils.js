export const deserialize = data$ => data$
    .map(data => JSON.parse(data) || {})
    .map(data => ({ list: [], ...data }));

export const serialize = state => JSON.stringify(state);

export const identity = val => val;

class PropertyHook {
  constructor(fn) {
    this.fn = fn;
  }

  hook(...args) {
    this.fn.apply(this, args);
  }
}

export const propHook = fn => new PropertyHook(fn);

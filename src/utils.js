export function deserialize(data$) {
  return data$
      .map(data => JSON.parse(data) || {})
      .map(data => ({ list: [], ...data }));
}

export function serialize(state) {
  return JSON.stringify(state);
}

export const deserialize = data$ => data$
    .map(data => JSON.parse(data) || {})
    .map(data => ({ list: [], ...data }));

export const serialize = data => JSON.stringify(data);

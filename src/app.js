// import Rx from 'rx';
import { run } from '@cycle/core';
import { div, input, h1, makeDOMDriver } from '@cycle/dom';
import storageDriver from '@cycle/storage';

const STORAGE_KEY = 'foo';

function main({ DOM, storage }) {
  const storage$ = DOM.select('.field')
    .events('input')
    .map(e => ({
      key: STORAGE_KEY,
      value: e.target.value,
    }));

  const vtree$ = storage.local.getItem(STORAGE_KEY)
    .startWith('')
    .map(text =>
      div([
        input('.field', {
          type: 'text',
          value: text,
        }),
        h1([
          text,
        ]),
      ])
    );

  return {
    DOM: vtree$,
    storage: storage$,
  };
}

const drivers = {
  DOM: makeDOMDriver('#app'),
  storage: storageDriver,
};

run(main, drivers);

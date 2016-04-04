import Rx from 'rx';
import Cycle from '@cycle/core';
import { div, makeDOMDriver } from '@cycle/dom';

function main() {
  return {
    DOM: Rx.Observable.of(
      div([
        '🐸',
      ])
    ),
  };
}

const drivers = {
  DOM: makeDOMDriver('#app'),
};

Cycle.run(main, drivers);

import { Observable } from 'rx';

import { run } from '@cycle/core';
import { makeDOMDriver } from '@cycle/dom';
import storageDriver from '@cycle/storage';

import app from './app';

const drivers = {
  DOM: makeDOMDriver('#app'),
  storage: storageDriver,
  initialHash: () => Observable.just(location.hash),
  hashChange: () => Observable.fromEvent(window, 'hashchange'),
};

run(app, drivers);

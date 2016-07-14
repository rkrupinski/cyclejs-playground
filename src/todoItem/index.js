import { Observable } from 'rx';

import isolate from '@cycle/isolate';

import intent from './intent';
import model from './model';
import view from './view';

function todoItem({ DOM, props$ }) {
  const action$ = intent(DOM);
  const state$ = model(props$, action$);
  const vtree$ = view(state$);

  return {
    DOM: vtree$,
    action$: Observable.combineLatest(
      props$,
      action$,
      ({ id }, action) => ({ id, ...action })
    ),
  };
}

export default sources => isolate(todoItem)(sources);

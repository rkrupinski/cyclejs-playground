import isolate from '@cycle/isolate';

import intent from './intent';
import model from './model';
import view from './view';

function todoForm({ DOM }) {
  const action$ = intent(DOM);
  const state$ = model(action$);
  const vtree$ = view(state$);

  return {
    DOM: vtree$,
    action$,
  };
}

export default sources => isolate(todoForm)(sources);

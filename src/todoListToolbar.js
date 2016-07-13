import { Observable } from 'rx';

import { div } from '@cycle/dom';

import toggleAllBtn from './toggleAllBtn';


function ammendState(DOM) {
  return function mapFn(state) {
    const { list } = state;

    return {
      ...state,
      toggle: toggleAllBtn({
        DOM,
        props$: Observable.just({
          disabled: !list.length,
        }),
      }),
    };
  };
}

function model(props$) {
  return props$;
}

function view(state$) {
  return state$
      .map(state => {
        const { toggle } = state;

        return Observable.combineLatest(
          toggle.DOM,
          toggleTree => div([
            toggleTree,
          ])
        );
      });
}

function todoListToolbar({ DOM, props$ }) {
  const state$ = model(props$);

  const ammendedState$ = state$
      .map(ammendState(DOM))
      .shareReplay(1);

  const action$ = ammendedState$
      .flatMapLatest(({ toggle }) => toggle.action$);

  const vtree$ = view(ammendedState$);

  return {
    DOM: vtree$,
    action$,
  };
}

export default todoListToolbar;

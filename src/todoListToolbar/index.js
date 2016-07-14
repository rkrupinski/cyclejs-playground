import { Observable } from 'rx';

import model from './model';
import view from './view';
import toggleAllBtn from '../toggleAllBtn';

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

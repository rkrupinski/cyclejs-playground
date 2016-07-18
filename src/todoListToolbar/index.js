import { Observable } from 'rx';

import model from './model';
import view from './view';
import toggleAllBtn from '../toggleAllBtn';
import clearCompletedBtn from '../clearCompletedBtn';
import itemsLeft from '../itemsLeft';


function ammendState(DOM) {
  return function mapFn(state) {
    const { list } = state;
    const completedCount = list
        .filter(({ completed }) => completed)
        .length;

    return {
      ...state,
      toggleBtn: toggleAllBtn({
        DOM,
        props$: Observable.just({
          disabled: !list.length,
        }),
      }),
      clearBtn: clearCompletedBtn({
        DOM,
        props$: Observable.just({
          disabled: !completedCount,
        }),
      }),
      itemsLeft: itemsLeft({
        props$: Observable.just({
          pending: list.length - completedCount,
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
      .flatMapLatest(({ toggleBtn, clearBtn }) => Observable.merge(
        toggleBtn.action$,
        clearBtn.action$
      ));

  const vtree$ = view(ammendedState$);

  return {
    DOM: vtree$,
    action$,
  };
}

export default todoListToolbar;

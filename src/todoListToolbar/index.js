import { Observable } from 'rx';

import model from './model';
import view from './view';
import toggleAllBtn from '../toggleAllBtn';
import clearCompletedBtn from '../clearCompletedBtn';

function hasCompleted(todos) {
  return todos.some(todo => todo.completed);
}

function ammendState(DOM) {
  return function mapFn(state) {
    const { list } = state;

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
          disabled: !hasCompleted(list),
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

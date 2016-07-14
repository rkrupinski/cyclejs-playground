import { Observable } from 'rx';

import model from './model';
import view from './view';
import todoItem from '../todoItem';

function ammendState(DOM) {
  return function mapFn(state) {
    return {
      ...state,
      list: state.list.map(data => {
        const itemSinks = todoItem({
          DOM,
          props$: Observable.just(data),
        });

        return {
          ...data,
          todoItem: itemSinks,
        };
      }),
    };
  };
}

function todoList({ DOM, props$ }) {
  const state$ = model(props$);

  const ammendedState$ = state$
      .map(ammendState(DOM))
      .shareReplay(1);

  const action$ = ammendedState$.flatMapLatest(({ list }) =>
      Observable.merge(list.map(data => data.todoItem.action$)));

  const vtree$ = view(ammendedState$);

  return {
    DOM: vtree$,
    action$,
  };
}

export default todoList;

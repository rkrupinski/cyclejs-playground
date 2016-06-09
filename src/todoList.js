import { Observable } from 'rx';

import { ul } from '@cycle/dom';

import todoItem from './todoItem';
import todoListPlaceholder from './todoListPlaceholder';

function ammendState(DOM) {
  return function mapFn(state) {
    return {
      ...state,
      list: state.list.map(data => {
        const itemProps$ = Observable.just(data);
        const itemSinks = todoItem({
          DOM,
          props$: itemProps$,
        });

        return {
          ...data,
          todoItem: itemSinks,
        };
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
        const hasTodos = !!state.list.length;

        return hasTodos ?
            ul(
              state.list.map(data => data.todoItem.DOM)
            ) :
            todoListPlaceholder().DOM;
      });
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

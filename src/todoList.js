import { Observable } from 'rx';

import { ul } from '@cycle/dom';
import isolate from '@cycle/isolate';

import todoItem from './todoItem';

function ammendState(state$, DOM) {
  return state$
      .map(state => ({
        ...state,
        list: state.list.map(data => {
          const todoItemProps$ = Observable.just(data);

          return {
            ...data,
            todoItem: todoItem({ DOM, props$: todoItemProps$ }),
          };
        }),
      }));
}

function model(props$) {
  return props$;
}

function view(state$) {
  return state$
      .map(state => ul(
        state.list.map(data => data.todoItem.DOM)
      ));
}

function todoList({ DOM, props$ }) {
  const state$ = model(props$);

  const ammendedState$ = ammendState(state$, DOM);

  const action$ = ammendedState$.flatMapLatest(({ list }) =>
      Observable.merge(list.map(data => data.todoItem.action$)));

  const vtree$ = view(ammendedState$);

  return {
    DOM: vtree$,
    action$,
  };
}

export default sources => isolate(todoList)(sources);

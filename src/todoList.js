import { Observable } from 'rx';
import { StyleSheet, css } from 'aphrodite';

import { ul } from '@cycle/dom';

import todoItem from './todoItem';

const styles = StyleSheet.create({
  todoList: {
    padding: 0,
    listStyle: 'none',
  },
});

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

function model(props$) {
  return props$;
}

function view(state$) {
  return state$
      .map(state => ul({
        className: css(styles.todoList),
      }, state.list.map(data => data.todoItem.DOM)));
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

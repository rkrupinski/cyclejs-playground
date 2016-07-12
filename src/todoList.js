import { Observable } from 'rx';
import { StyleSheet, css } from 'aphrodite';

import { ul, div, button } from '@cycle/dom';

import constants from './constants';
import todoItem from './todoItem';
import todoListPlaceholder from './todoListPlaceholder';

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

function intent(DOM) {
  return Observable.merge(
    DOM
        .select('.toggle-btn')
        .events('click')
        .map(() => ({ type: constants.TODO_TOGGLE_ALL }))
  );
}

function model(props$) {
  return props$;
}

function view(state$) {
  return state$
      .map(state => {
        const hasTodos = !!state.list.length;

        return hasTodos ?
            div([
              ul({
                className: css(styles.todoList),
              }, state.list.map(data => data.todoItem.DOM)),
              button('.toggle-btn', 'Toggle all'),
            ]) :
            todoListPlaceholder().DOM;
      });
}

function todoList({ DOM, props$ }) {
  const action$ = intent(DOM);
  const state$ = model(props$);

  const ammendedState$ = state$
      .map(ammendState(DOM))
      .shareReplay(1);

  const itemAction$ = ammendedState$.flatMapLatest(({ list }) =>
      Observable.merge(list.map(data => data.todoItem.action$)));

  const vtree$ = view(ammendedState$);

  return {
    DOM: vtree$,
    action$: Observable.merge(action$, itemAction$),
  };
}

export default todoList;

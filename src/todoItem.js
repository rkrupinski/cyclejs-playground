import { Observable } from 'rx';
import { StyleSheet, css } from 'aphrodite';

import { li } from '@cycle/dom';
import isolate from '@cycle/isolate';

import constants from './constants';

const styles = StyleSheet.create({
  todoItem: {
    cursor: 'pointer',
    ':hover': {
      background: 'gainsboro',
    },
  },
});

function intent(DOM) {
  return Observable.merge(
    DOM
        .select('li')
        .events('click')
        .map(() => ({ type: constants.TODO_TOGGLE }))
  )
      .share();
}

function model(props$) {
  return props$;
}

function view(state$) {
  return state$
      .map(({ body, completed }) => li({
        className: css(styles.todoItem),
        style: {
          textDecoration: completed ? 'line-through' : 'none',
        },
      }, body));
}

function todoItem({ DOM, props$ }) {
  const action$ = intent(DOM);
  const state$ = model(props$);
  const vtree$ = view(state$);

  return {
    DOM: vtree$,
    action$: Observable.combineLatest(
      props$,
      action$,
      ({ id }, action) => ({ id, ...action })
    ),
  };
}

export default sources => isolate(todoItem)(sources);

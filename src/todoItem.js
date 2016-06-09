import { Observable } from 'rx';
import { StyleSheet, css } from 'aphrodite';

import { li, span } from '@cycle/dom';
import isolate from '@cycle/isolate';

import constants from './constants';

const styles = StyleSheet.create({
  todoToggle: {
    cursor: 'pointer',
    userSelect: 'none',
    ':hover': {
      background: 'lightcyan',
    },
  },
});

function intent(DOM) {
  return Observable.merge(
    DOM
        .select('.todo-toggle')
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
      .map(({ body, completed }) => li(
        span({
          className: `${css(styles.todoToggle)} todo-toggle`,
          style: {
            textDecoration: completed ? 'line-through' : 'none',
          },
        }, body)
      ));
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

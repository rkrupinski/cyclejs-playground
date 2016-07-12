import { Observable } from 'rx';
import { StyleSheet, css } from 'aphrodite';

import { li, span, button, input } from '@cycle/dom';
import isolate from '@cycle/isolate';

import constants from './constants';
import { propHook } from './utils';

const styles = StyleSheet.create({
  todo: {
    marginBottom: 5,
  },
  todoToggle: {
    margin: '0 5px 0 0',
  },
  todoBody: {
    cursor: 'pointer',
    userSelect: 'none',
    ':hover': {
      background: 'lightcyan',
    },
  },
  todoInput: {
  },
  todoDelete: {
    marginLeft: 5,
  },
});

function intent(DOM) {
  return Observable.merge(
    DOM
        .select('.todo-toggle')
        .events('click')
        .map(() => ({ type: constants.TODO_TOGGLE })),
    DOM
        .select('.todo-delete')
        .events('click')
        .map(() => ({ type: constants.TODO_DELETE })),
    DOM
        .select('.todo-body')
        .events('click')
        .map(() => ({ type: constants.TODO_START_EDITING })),
    DOM
        .select('.todo-input')
        .events('keyup')
        .filter(e => e.keyCode === constants.ENTER_KEY)
        .map(e => ({
          type: constants.TODO_DONE_EDITING,
          body: e.target.value,
        })),
    DOM
        .select('.todo-input')
        .events('keyup')
        .filter(e => e.keyCode === constants.ESCAPE_KEY)
        .map(() => ({ type: constants.TODO_CANCEL_EDITING })),
    DOM
        .select('.todo-input')
        .events('blur')
        .map(() => ({ type: constants.TODO_CANCEL_EDITING }))
  )
      .share();
}

function model(props$, action$) {
  const editing$ = Observable.merge(
    action$
        .filter(({ type }) => type === constants.TODO_START_EDITING)
        .map(() => true),
    action$
        .filter(({ type }) => type === constants.TODO_DONE_EDITING)
        .map(() => false),
    action$
        .filter(({ type }) => type === constants.TODO_CANCEL_EDITING)
        .map(() => false)
  )
      .startWith(false);

  return Observable.combineLatest(
    props$,
    editing$,
    (props, editing) => ({ ...props, editing })
  );
}

function view(state$) {
  return state$
      .map(({ body, completed, editing }) => li({
        className: `${css(styles.todo)}`,
      }, [
        input({
          className: `${css(styles.todoToggle)} todo-toggle`,
          type: 'checkbox',
          checked: completed,
        }),
        span({
          className: `${css(styles.todoBody)} todo-body`,
          style: editing ? { display: 'none' } : null,
          title: 'Edit',
        }, body),
        input({
          className: `${css(styles.todoInput)} todo-input`,
          style: !editing ? { display: 'none' } : null,
          type: 'text',
          value: propHook(el => {
            el.value = body;

            if (editing) {
              el.focus();
              el.selectionStart = body.length;
            }
          }),
        }),
        button({
          className: `${css(styles.todoDelete)} todo-delete`,
        }, 'x'),
      ]));
}

function todoItem({ DOM, props$ }) {
  const action$ = intent(DOM);
  const state$ = model(props$, action$);
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

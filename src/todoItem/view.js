import { StyleSheet, css } from 'aphrodite';

import { li, span, button, input } from '@cycle/dom';

import { propHook } from '../utils';

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

export default view;

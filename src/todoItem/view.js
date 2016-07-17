import { StyleSheet, css } from 'aphrodite';

import { li, span, button, input } from '@cycle/dom';

import { propHook } from '../utils';

const styles = StyleSheet.create({
  todo: {
    marginBottom: 10,
  },
  todoBody: {
    lineHeight: 1,
    cursor: 'pointer',
    userSelect: 'none',
    ':hover': {
      background: 'lightcyan',
      outline: '2px solid lightcyan',
    },
  },
});

function view(state$) {
  return state$
      .map(({ body, completed, editing }) => li({
        className: `${css(styles.todo)}`,
      }, [
        input('.todo-toggle', {
          type: 'checkbox',
          checked: completed,
        }),
        ' ',
        span({
          className: `${css(styles.todoBody)} todo-body`,
          style: editing ? { display: 'none' } : null,
          title: 'Edit',
        }, body),
        input('.todo-input', {
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
        ' ',
        button('.todo-delete', 'x'),
      ]));
}

export default view;

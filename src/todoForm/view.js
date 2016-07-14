import { form, input, button } from '@cycle/dom';

import { StyleSheet, css } from 'aphrodite';

const styles = StyleSheet.create({
  addTodoBtn: {
    marginLeft: 5,
  },
});

function view(state$) {
  return state$
      .map(value => form('.todo-form', [
        input('.todo-input', {
          type: 'text',
          value,
        }),
        button({
          className: css(styles.addTodoBtn),
          type: 'submit',
        }, 'Add todo'),
      ]));
}

export default view;

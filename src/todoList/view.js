import { StyleSheet, css } from 'aphrodite';

import { ul } from '@cycle/dom';

const styles = StyleSheet.create({
  todoList: {
    padding: 0,
    listStyle: 'none',
  },
});

function view(state$) {
  return state$
      .map(state => ul({
        className: css(styles.todoList),
      }, state.list.map(data => data.todoItem.DOM)));
}

export default view;

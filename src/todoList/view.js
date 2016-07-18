import { StyleSheet, css } from 'aphrodite';

import { ul, p } from '@cycle/dom';

import constants from '../constants';

const styles = StyleSheet.create({
  todoList: {
    padding: 0,
    listStyle: 'none',
  },
});

function getFilterFn(filter) {
  switch (filter) {
    case constants.FILTER_PENDING:
      return ({ completed }) => !completed;
    case constants.FILTER_COMPLETED:
      return ({ completed }) => completed;
    default:
      return () => true;
  }
}

function renderTodos(list, currentFilter) {
  const filteredList = list
      .filter(getFilterFn(currentFilter));

  return filteredList.length ?
      filteredList.map(data => data.todoItem.DOM) :
      p('Hooray, no todos!');
}

function view(state$) {
  return state$
      .map(state => {
        const { list, filter: currentFilter } = state;

        return ul({
          className: css(styles.todoList),
        }, renderTodos(list, currentFilter));
      });
}

export default view;

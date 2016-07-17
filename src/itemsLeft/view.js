import { StyleSheet, css } from 'aphrodite';

import { span } from '@cycle/dom';

const styles = StyleSheet.create({
  itemsLeft: {
    fontSize: 11,
  },
});

function view(state$) {
  return state$.map(state => {
    const { pending } = state;

    return span({
      className: css(styles.itemsLeft),
    }, `${pending} item${pending !== 1 ? 's' : ''} left`);
  });
}

export default view;

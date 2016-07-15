import { StyleSheet, css } from 'aphrodite';

import { button } from '@cycle/dom';


const styles = StyleSheet.create({
  clearBtn: {
    marginLeft: 5,
  },
});


function view(state$) {
  return state$.map(state => button({
    className: `${css(styles.clearBtn)} clear-btn`,
    disabled: state.disabled,
  }, 'Clear completed'));
}

export default view;

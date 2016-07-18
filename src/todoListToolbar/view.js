import { Observable } from 'rx';
import { StyleSheet, css } from 'aphrodite';

const styles = StyleSheet.create({
  toolbar: {
    marginBottom: 10,
  },
});

import { div } from '@cycle/dom';

function view(state$) {
  return state$
      .map(state => {
        const { toggleBtn, clearBtn, itemsLeft } = state;

        return Observable.combineLatest(
          toggleBtn.DOM,
          clearBtn.DOM,
          itemsLeft.DOM,
          (toggleBtnTree, clearBtnTree, itemsLeftTree) => div({
            className: css(styles.toolbar),
          }, [
            toggleBtnTree,
            ' ',
            clearBtnTree,
            ' ',
            itemsLeftTree,
          ])
        );
      });
}

export default view;

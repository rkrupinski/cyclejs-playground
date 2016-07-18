import { Observable } from 'rx';
import { StyleSheet, css } from 'aphrodite';

import { div } from '@cycle/dom';

const styles = StyleSheet.create({
  app: {
    font: '.75rem sans-serif',
  },
});

function view(state$) {
  return state$
      .map(state => {
        const { form, list, toolbar, nav } = state;

        return Observable.combineLatest(
          form.DOM,
          list.DOM,
          toolbar.DOM,
          nav.DOM,
          (formTree, listTree, toolbarTree, navTree) => div({
            className: css(styles.app),
          }, [
            formTree,
            listTree,
            toolbarTree,
            navTree,
          ])
        );
      });
}

export default view;

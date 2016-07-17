import { Observable } from 'rx';
import { StyleSheet, css } from 'aphrodite';

import { div } from '@cycle/dom';

const styles = StyleSheet.create({
  app: {
    fontFamily: 'sans-serif',
  },
});

function view(state$) {
  return state$
      .map(state => {
        const { form, list, toolbar } = state;

        return Observable.combineLatest(
          form.DOM,
          list.DOM,
          toolbar.DOM,
          (formTree, listTree, toolbarTree) => div({
            className: css(styles.app),
          }, [
            formTree,
            listTree,
            toolbarTree,
          ])
        );
      });
}

export default view;

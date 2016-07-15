import { Observable } from 'rx';

import { div } from '@cycle/dom';

function view(state$) {
  return state$
      .map(state => {
        const { form, list, toolbar } = state;

        return Observable.combineLatest(
          form.DOM,
          list.DOM,
          toolbar.DOM,
          (formTree, listTree, toolbarTree) => div([
            formTree,
            listTree,
            toolbarTree,
          ])
        );
      });
}

export default view;

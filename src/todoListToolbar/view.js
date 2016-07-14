import { Observable } from 'rx';

import { div } from '@cycle/dom';

function view(state$) {
  return state$
      .map(state => {
        const { toggle } = state;

        return Observable.combineLatest(
          toggle.DOM,
          toggleTree => div([
            toggleTree,
          ])
        );
      });
}

export default view;

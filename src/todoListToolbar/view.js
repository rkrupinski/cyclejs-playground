import { Observable } from 'rx';

import { div } from '@cycle/dom';

function view(state$) {
  return state$
      .map(state => {
        const { toggleBtn, clearBtn } = state;

        return Observable.combineLatest(
          toggleBtn.DOM,
          clearBtn.DOM,
          (toggleBtnTree, clearBtnTree) => div([
            toggleBtnTree,
            clearBtnTree,
          ])
        );
      });
}

export default view;

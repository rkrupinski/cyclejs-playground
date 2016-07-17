import { Observable } from 'rx';

import { div } from '@cycle/dom';

function view(state$) {
  return state$
      .map(state => {
        const { toggleBtn, clearBtn, itemsLeft } = state;

        return Observable.combineLatest(
          toggleBtn.DOM,
          clearBtn.DOM,
          itemsLeft.DOM,
          (toggleBtnTree, clearBtnTree, itemsLeftTree) => div([
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

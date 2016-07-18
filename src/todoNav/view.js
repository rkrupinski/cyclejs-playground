import { Observable } from 'rx';

import { div } from '@cycle/dom';

import filterLink from '../filterLink';
import constants from '../constants';

function view(state$) {
  return state$.flatMapLatest(({ filter: currentFilter }) =>
      Observable.combineLatest(
        filterLink({
          props$: Observable.just({
            label: 'all',
            filter: constants.FILTER_ALL,
            currentFilter,
          }),
        }).DOM,
        filterLink({
          props$: Observable.just({
            label: 'pending',
            filter: constants.FILTER_PENDING,
            currentFilter,
          }),
        }).DOM,
        filterLink({
          props$: Observable.just({
            label: 'completed',
            filter: constants.FILTER_COMPLETED,
            currentFilter,
          }),
        }).DOM,
        (allLinkTree, pendingLinkTree, completedLinkTree) => div([
          'View: ',
          allLinkTree,
          ' ',
          pendingLinkTree,
          ' ',
          completedLinkTree,
        ])
      ));
}

export default view;

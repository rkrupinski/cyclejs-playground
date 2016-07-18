import { Observable } from 'rx';

import { div } from '@cycle/dom';

import filterLink from '../filterLink';
import constants from '../constants';

function view(state$) {
  return state$.flatMapLatest(({ filter }) =>
      Observable.combineLatest(
        filterLink({
          props$: Observable.just({
            label: 'all',
            filter: constants.FILTER_ALL,
            currentFilter: filter,
          }),
        }).DOM,
        filterLink({
          props$: Observable.just({
            label: 'pending',
            filter: constants.FILTER_PENDING,
            currentFilter: filter,
          }),
        }).DOM,
        filterLink({
          props$: Observable.just({
            label: 'completed',
            filter: constants.FILTER_COMPLETED,
            currentFilter: filter,
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

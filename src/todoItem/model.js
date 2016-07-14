import { Observable } from 'rx';

import constants from '../constants';

function model(props$, action$) {
  const editing$ = Observable.merge(
    action$
        .filter(({ type }) => type === constants.TODO_START_EDITING)
        .map(() => true),
    action$
        .filter(({ type }) => type === constants.TODO_DONE_EDITING)
        .map(() => false),
    action$
        .filter(({ type }) => type === constants.TODO_CANCEL_EDITING)
        .map(() => false)
  )
      .startWith(false);

  return Observable.combineLatest(
    props$,
    editing$,
    (props, editing) => ({ ...props, editing })
  );
}

export default model;

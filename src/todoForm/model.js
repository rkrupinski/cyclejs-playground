import { Observable } from 'rx';

import constants from '../constants';

function model(action$) {
  return Observable.merge(
    action$
        .filter(({ type }) => type === constants.FORM_INPUT)
        .map(({ value }) => value),
    action$
        .filter(({ type }) => type === constants.FORM_SUBMIT)
        .map(() => '')
  )
      .startWith('');
}

export default model;

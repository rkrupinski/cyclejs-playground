import { Observable } from 'rx';

import constants from '../constants';

function intent(DOM) {
  return Observable.merge(
    DOM
        .select('.clear-btn')
        .events('click')
        .map(() => ({ type: constants.TODO_CLEAR_COMPLETED }))
  )
      .share();
}

export default intent;

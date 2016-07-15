import { Observable } from 'rx';

import constants from '../constants';

function intent(DOM) {
  return Observable.merge(
    DOM
        .select('.toggle-btn')
        .events('click')
        .map(() => ({ type: constants.TODO_TOGGLE_ALL }))
  )
      .share();
}

export default intent;

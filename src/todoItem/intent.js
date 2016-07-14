import { Observable } from 'rx';

import constants from '../constants';

function intent(DOM) {
  return Observable.merge(
    DOM
        .select('.todo-toggle')
        .events('click')
        .map(() => ({ type: constants.TODO_TOGGLE })),
    DOM
        .select('.todo-delete')
        .events('click')
        .map(() => ({ type: constants.TODO_DELETE })),
    DOM
        .select('.todo-body')
        .events('click')
        .map(() => ({ type: constants.TODO_START_EDITING })),
    DOM
        .select('.todo-input')
        .events('keyup')
        .filter(e => e.keyCode === constants.ENTER_KEY)
        .map(e => ({
          type: constants.TODO_DONE_EDITING,
          body: e.target.value,
        })),
    DOM
        .select('.todo-input')
        .events('keyup')
        .filter(e => e.keyCode === constants.ESCAPE_KEY)
        .map(() => ({ type: constants.TODO_CANCEL_EDITING })),
    DOM
        .select('.todo-input')
        .events('blur')
        .map(() => ({ type: constants.TODO_CANCEL_EDITING }))
  )
      .share();
}

export default intent;

import { Observable } from 'rx';

import constants from '../constants';

function intent(DOM) {
  return Observable.merge(
    DOM
        .select('.todo-input')
        .events('input')
        .map(e => ({
          type: constants.FORM_INPUT,
          body: e.target.value,
        })),
    DOM
        .select('.todo-form')
        .events('submit')
        .do(e => e.preventDefault())
        .map(() => ({
          type: constants.FORM_SUBMIT,
        }))
  )
      .share();
}

export default intent;

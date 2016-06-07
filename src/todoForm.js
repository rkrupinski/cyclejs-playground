import { Observable } from 'rx';

import { form, input, button } from '@cycle/dom';
import isolate from '@cycle/isolate';

import constants from './constants';

function intent(DOM) {
  return Observable.merge(
    DOM
        .select('.todo-input')
        .events('input')
        .map(e => ({
          type: constants.FORM_INPUT,
          value: e.target.value,
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

function view(state$) {
  return state$
      .map(value => form('.todo-form', [
        input('.todo-input', {
          type: 'text',
          value,
        }),
        button({ type: 'submit' }, 'Add todo'),
      ]));
}

function todoForm({ DOM }) {
  const action$ = intent(DOM);
  const state$ = model(action$);
  const vtree$ = view(state$);

  return {
    DOM: vtree$,
    action$,
  };
}

export default sources => isolate(todoForm)(sources);

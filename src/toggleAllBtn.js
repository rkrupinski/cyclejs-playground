import { Observable } from 'rx';

import { button } from '@cycle/dom';

import constants from './constants';

function intent(DOM) {
  return Observable.merge(
    DOM
        .select('.toggle-btn')
        .events('click')
        .map(() => ({ type: constants.TODO_TOGGLE_ALL }))
  );
}

function model(props$) {
  return Observable.combineLatest(
    props$,
    props => props
  );
}

function view(state$) {
  return state$.map(state => button('.toggle-btn', {
    disabled: state.disabled,
  }, 'Toggle all'));
}

function toggleAllBtn({ DOM, props$ }) {
  const action$ = intent(DOM);
  const state$ = model(props$);
  const vtree$ = view(state$);

  return {
    DOM: vtree$,
    action$,
  };
}

export default toggleAllBtn;

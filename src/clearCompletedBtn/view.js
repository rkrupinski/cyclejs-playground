import { button } from '@cycle/dom';

function view(state$) {
  return state$.map(state => button('.clear-btn', {
    disabled: state.disabled,
  }, 'Clear completed'));
}

export default view;

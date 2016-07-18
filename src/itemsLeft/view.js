import { span } from '@cycle/dom';

function view(state$) {
  return state$.map(state => {
    const { pending } = state;

    return span(`${pending} item${pending !== 1 ? 's' : ''} left`);
  });
}

export default view;

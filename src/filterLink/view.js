import { a, span } from '@cycle/dom';

function view(state$) {
  return state$.map(state => {
    const { label, filter, currentFilter } = state;

    return filter !== currentFilter ? a({
      href: `#/${filter}`,
    }, label) : span(label);
  });
}

export default view;

import { Observable } from 'rx';

import { p } from '@cycle/dom';

function view() {
  return Observable.just(
    p('Hooray, no todos!')
  );
}

function todoListPlaceholder() {
  const vtree$ = view();

  return {
    DOM: vtree$,
    action$: Observable.empty(), // I wish I used TypeScript :(
  };
}

export default todoListPlaceholder;

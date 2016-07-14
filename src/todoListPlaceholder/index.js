import { Observable } from 'rx';

import view from './view';

function todoListPlaceholder() {
  const vtree$ = view();

  return {
    DOM: vtree$,
    action$: Observable.empty(), // I wish I used TypeScript :(
  };
}

export default todoListPlaceholder;

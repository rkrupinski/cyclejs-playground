import { Observable } from 'rx';

import { ul, li } from '@cycle/dom';

function TodoList() {
  return {
    DOM: Observable.of(
      ul([
        li(['lorem']),
        li(['ipsum']),
      ])
    ),
  };
}

export default TodoList;

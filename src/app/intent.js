import { Observable } from 'rx';

import constants from '../constants';

function intent(actions$, initialHash, hashChange) {
  const formInput$ = actions$
      .filter(({ type }) => type === constants.FORM_INPUT);

  const formSubmit$ = actions$
      .filter(({ type }) => type === constants.FORM_SUBMIT);

  return {
    routeChange$: Observable.concat(
      initialHash.map(hash => hash.slice(1)),
      hashChange.map(e => e.newURL.split('#').pop())
    )
        .map(route => {
          const [, filter] = /\/?([^#]*)$/.exec(route);

          return filter;
        }),
    addTodo$: formInput$
        .sample(formSubmit$)
        .pluck('body')
        .filter(Boolean),
    toggleTodo$: actions$
        .filter(({ type }) => type === constants.TODO_TOGGLE),
    deleteTodo$: actions$
        .filter(({ type }) => type === constants.TODO_DELETE),
    updateTodo$: actions$
        .filter(({ type, body }) => type === constants.TODO_DONE_EDITING && body),
    toggleAll$: actions$
        .filter(({ type }) => type === constants.TODO_TOGGLE_ALL),
    clearCompleted$: actions$
        .filter(({ type }) => type === constants.TODO_CLEAR_COMPLETED),
  };
}

export default intent;

import constants from '../constants';

function intent(actions$) {
  const formInput$ = actions$
      .filter(({ type }) => type === constants.FORM_INPUT);

  const formSubmit$ = actions$
      .filter(({ type }) => type === constants.FORM_SUBMIT);

  return {
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

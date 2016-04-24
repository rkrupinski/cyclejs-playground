import { Observable } from 'rx';

import { form, input, button } from '@cycle/dom';

const intent = DOMSource => {
  const input$ = DOMSource
      .select('.todo-input')
      .events('input')
      .map(e => e.target.value)
      .share();

  const submit$ = DOMSource
      .select('.todo-form')
      .events('submit')
      .do(ev => ev.preventDefault());

  return {
    input$,
    submit$,
  };
};

const model = actions => {
  const { input$, submit$ } = actions;

  const value$ = Observable.merge(
    input$,
    submit$.map(() => '')
  ).startWith('');

  return Observable.combineLatest(
    value$,
    value => ({ value })
  );
};

const view = state$ => state$.map(({ value }) =>
  form('.todo-form', [
    input('.todo-input', {
      type: 'text',
      value,
    }),
    button({ type: 'submit' }, ['Add todo']),
  ])
);

function TodoForm({ DOM }) {
  const actions = intent(DOM);
  const state$ = model(actions);
  const vtree$ = view(state$);

  return {
    DOM: vtree$,
    todo: actions.input$
        .sample(actions.submit$)
        .filter(Boolean)
        .share(),
  };
}

export default TodoForm;

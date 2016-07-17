import { form, input, button } from '@cycle/dom';

function view(state$) {
  return state$
      .map(value => form('.todo-form', [
        input('.todo-input', {
          type: 'text',
          value,
        }),
        ' ',
        button({
          type: 'submit',
        }, 'Add todo'),
      ]));
}

export default view;

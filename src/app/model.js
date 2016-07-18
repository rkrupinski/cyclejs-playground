import { Observable } from 'rx';
import { v4 } from 'node-uuid';

function model(actions, data$) {
  const routeChangeMod$ = actions.routeChange$
      .map(filter => data => ({
        ...data,
        filter,
      }));

  const addTodoMod$ = actions.addTodo$
      .map(body => data => ({
        ...data,
        list: [
          ...data.list,
          {
            id: v4(),
            completed: false,
            body: body.trim(),
          },
        ],
      }));

  const toggleTodoMod$ = actions.toggleTodo$
      .map(({ id }) => data => ({
        ...data,
        list: data.list.map(todo => {
          if (todo.id !== id) {
            return todo;
          }

          return {
            ...todo,
            completed: !todo.completed,
          };
        }),
      }));

  const deleteTodoMod$ = actions.deleteTodo$
      .map(({ id }) => data => ({
        ...data,
        list: data.list.filter(todo => todo.id !== id),
      }));

  const editTodoMod$ = actions.updateTodo$
      .map(({ id, body }) => data => ({
        ...data,
        list: data.list.map(todo => {
          if (todo.id !== id) {
            return todo;
          }

          return {
            ...todo,
            body: body.trim(),
          };
        }),
      }));

  const toggleAllMod$ = actions.toggleAll$
      .map(() => data => {
        const pending = data.list.some(({ completed }) => !completed);

        return {
          ...data,
          list: data.list.map(item => ({
            ...item,
            completed: pending,
          })),
        };
      });

  const clearCompletedMod$ = actions.clearCompleted$
      .map(() => data => ({
        ...data,
        list: data.list.filter(({ completed }) => !completed),
      }));

  const modifications$ = Observable.merge(
    routeChangeMod$,
    addTodoMod$,
    toggleTodoMod$,
    deleteTodoMod$,
    editTodoMod$,
    toggleAllMod$,
    clearCompletedMod$
  );

  return data$
      .concat(modifications$)
      .scan((data, fn) => fn(data))
      .shareReplay(1);
}

export default model;

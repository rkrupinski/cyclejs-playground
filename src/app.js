import { Observable } from 'rx';

import { run } from '@cycle/core';
import { makeDOMDriver, div } from '@cycle/dom';
import isolate from '@cycle/isolate';
import storageDriver from '@cycle/storage';

import TodoForm from './todoForm';
import TodoList from './todoList';

import { serialize, deserialize } from './utils';

const STORAGE_KEY = 'todos';

function main(sources) {
  const todoFormSinks = isolate(TodoForm)(sources);
  const todoListSinks = isolate(TodoList)({ ...sources });

  const initialTodosData$ = sources.storage.local
      .getItem(STORAGE_KEY)
      .map(deserialize)
      .take(1);

  const intent = todoSource => {
    const addTodo$ = todoSource;

    return {
      addTodo$,
    };
  };

  const model = (act, todosData$) => {
    const addTodoMod$ = act.addTodo$
        .map(body => todoData => {
          const lastId = todoData.length ?
              todoData[todoData.length - 1].id :
              0;

          todoData.push({
            id: lastId + 1,
            completed: false,
            body,
          });

          return todoData;
        });

    const modifications$ = Observable.merge(
      addTodoMod$
    );

    return todosData$
        .concat(modifications$)
        .scan((todosData, fn) => fn(todosData))
        .shareReplay(1);
  };

  const view = () => {
    const vtree$ = Observable.combineLatest(
      todoFormSinks.DOM,
      todoListSinks.DOM,
      (formTree, listTree) => div([
        formTree,
        listTree,
      ])
    );

    return vtree$;
  };

  const actions = intent(todoFormSinks.todo);

  const state$ = model(actions, initialTodosData$);

  const vtree$ = view(state$);

  const storage$ = state$
      .map(serialize)
      .map(state => ({
        key: STORAGE_KEY,
        value: state,
      }));

  return {
    DOM: vtree$,
    storage: storage$,
  };
}

const drivers = {
  DOM: makeDOMDriver('#app'),
  storage: storageDriver,
};

run(main, drivers);

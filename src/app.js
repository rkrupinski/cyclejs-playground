import { Observable, Subject } from 'rx';
import { v4 } from 'node-uuid';

import { run } from '@cycle/core';
import { makeDOMDriver, div } from '@cycle/dom';
import storageDriver from '@cycle/storage';

import constants from './constants';
import todoForm from './todoForm';
import todoList from './todoList';
import todoListPlaceholder from './todoListPlaceholder';
import todoListToolbar from './todoListToolbar';

import { serialize, deserialize } from './utils';

const STORAGE_KEY = '__todos';

function ammendState(DOM) {
  return function mapFn(state) {
    const formSinks = todoForm({ DOM });

    const listSinks = state.list.length ?
        todoList({
          DOM,
          props$: Observable.just(state),
        }) :
        todoListPlaceholder();

    const toolbarSinks = todoListToolbar({
      DOM,
      props$: Observable.just(state),
    });

    return {
      ...state,
      form: formSinks,
      list: listSinks,
      toolbar: toolbarSinks,
    };
  };
}

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

function model(actions, data$) {
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

function view(state$) {
  return state$
      .map(state => {
        const { form, list, toolbar } = state;

        return Observable.combineLatest(
          form.DOM,
          list.DOM,
          toolbar.DOM,
          (formTree, listTree, toolbarTree) => div([
            formTree,
            listTree,
            toolbarTree,
          ])
        );
      });
}

function main({ DOM, storage }) {
  const localStorageData$ = storage.local
      .getItem(STORAGE_KEY)
      .take(1);

  const initialTodosData$ = deserialize(localStorageData$);

  const proxyActions$ = new Subject();

  const actions$ = intent(proxyActions$);

  const state$ = model(actions$, initialTodosData$);

  const ammendedState$ = state$
      .map(ammendState(DOM))
      .shareReplay(1);

  ammendedState$
      .flatMapLatest(({ form, list, toolbar }) => Observable.merge(
        form.action$,
        list.action$,
        toolbar.action$
      ))
      .subscribe(proxyActions$);

  const vtree$ = view(ammendedState$);

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

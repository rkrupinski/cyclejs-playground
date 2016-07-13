import { Observable, Subject } from 'rx';

import find from 'lodash.find';
import findIndex from 'lodash.findIndex';

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

function intent(formActions$, listActions$, toolbarActions$) {
  const formInput$ = formActions$
      .filter(({ type }) => type === constants.FORM_INPUT);

  const formSubmit$ = formActions$
      .filter(({ type }) => type === constants.FORM_SUBMIT);

  return {
    addTodo$: formInput$
        .sample(formSubmit$)
        .pluck('body')
        .filter(Boolean),
    toggleTodo$: listActions$
        .filter(({ type }) => type === constants.TODO_TOGGLE),
    deleteTodo$: listActions$
        .filter(({ type }) => type === constants.TODO_DELETE),
    updateTodo$: listActions$
        .filter(({ type, body }) => type === constants.TODO_DONE_EDITING && body),
    toggleAll$: toolbarActions$
        .filter(({ type }) => type === constants.TODO_TOGGLE_ALL),
  };
}

function model(actions, data$) {
  const addTodoMod$ = actions.addTodo$
      .map(body => data => {
        const { list } = data;
        const lastId = list.length ?
            list[list.length - 1].id :
            0;

        list.push({
          id: lastId + 1,
          completed: false,
          body: body.trim(),
        });

        return data;
      });

  const toggleTodoMod$ = actions.toggleTodo$
      .map(({ id }) => data => {
        const { list } = data;
        const todo = find(list, item => item.id === id);

        todo.completed = !todo.completed;

        return data;
      });

  const deleteTodoMod$ = actions.deleteTodo$
      .map(({ id }) => data => {
        const { list } = data;
        const index = findIndex(list, item => item.id === id);

        list.splice(index, 1);

        return data;
      });

  const editTodoMod$ = actions.updateTodo$
      .map(({ id, body }) => data => {
        const { list } = data;
        const todo = find(list, item => item.id === id);

        todo.body = body.trim();

        return data;
      });

  const toggleAllMod$ = actions.toggleAll$
      .map(() => data => {
        const { list } = data;
        const pending = list.some(todo => !todo.completed);

        list.forEach(item => (item.completed = pending));

        return data;
      });

  const modifications$ = Observable.merge(
    addTodoMod$,
    toggleTodoMod$,
    deleteTodoMod$,
    editTodoMod$,
    toggleAllMod$
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

  const proxyFormActions$ = new Subject();
  const proxyListActions$ = new Subject();
  const proxyToolbarActions$ = new Subject();

  const actions = intent(
    proxyFormActions$,
    proxyListActions$,
    proxyToolbarActions$
  );

  const state$ = model(actions, initialTodosData$);

  const ammendedState$ = state$
      .map(ammendState(DOM))
      .shareReplay(1);

  const formActions$ = ammendedState$
      .flatMapLatest(({ form }) => form.action$);

  const listActions$ = ammendedState$
      .flatMapLatest(({ list }) => list.action$);

  const toolbarActions$ = ammendedState$
      .flatMapLatest(({ toolbar }) => toolbar.action$);

  formActions$.subscribe(proxyFormActions$);
  listActions$.subscribe(proxyListActions$);
  toolbarActions$.subscribe(proxyToolbarActions$);

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

import { Observable, Subject } from 'rx';

import { run } from '@cycle/core';
import { makeDOMDriver, div } from '@cycle/dom';
import storageDriver from '@cycle/storage';

import constants from './constants';
import todoForm from './todoForm';
import todoList from './todoList';

import { serialize, deserialize } from './utils';

const STORAGE_KEY = '__todos';

function ammendState(state$, DOM) {
  return state$
      .map(state => {
        const todoFormSinks = todoForm({ DOM });
        const todoListProps$ = Observable.just(state);
        const todoListSinks = todoList({
          DOM,
          props$: todoListProps$,
        });

        return {
          ...state,
          form: todoFormSinks,
          list: todoListSinks,
        };
      });
}

function intent(formActions$, listActions$) {
  const formInput$ = formActions$
      .filter(({ type }) => type === constants.FORM_INPUT);

  const formSubmit$ = formActions$
      .filter(({ type }) => type === constants.FORM_SUBMIT);

  return {
    addTodo$: formInput$
        .sample(formSubmit$)
        .pluck('value')
        .filter(Boolean),
    toggleTodo$: listActions$
        .filter(({ type }) => type === constants.TODO_TOGGLE),
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
          body,
        });

        return data;
      });

  const toggleTodoMod$ = actions.toggleTodo$
      .map(({ id }) => data => {
        console.log(id);
        // TODO: toggling logic :)

        return data;
      });

  const modifications$ = Observable.merge(
    addTodoMod$,
    toggleTodoMod$
  );

  return data$
      .concat(modifications$)
      .scan((data, fn) => fn(data))
      .shareReplay(1);
}

function view(state$) {
  return state$
      .map(state => Observable.combineLatest(
        state.form.DOM,
        state.list.DOM,
        (formTree, listTree) => div([
          formTree,
          listTree,
        ])
      ));
}

function main({ DOM, storage }) {
  const localStorageData$ = storage.local
      .getItem(STORAGE_KEY)
      .take(1);

  const initialTodosData$ = deserialize(localStorageData$);

  const proxyFormActions$ = new Subject();
  const proxyListActions$ = new Subject();

  const actions = intent(proxyFormActions$, proxyListActions$);

  const state$ = model(actions, initialTodosData$);

  const ammendedState$ = ammendState(state$, DOM);

  const formActions$ = ammendedState$.flatMapLatest(({ form }) =>
      form.action$);

  const listActions$ = ammendedState$.flatMapLatest(({ list }) =>
      list.action$);

  formActions$.subscribe(proxyFormActions$);
  listActions$.subscribe(proxyListActions$);

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

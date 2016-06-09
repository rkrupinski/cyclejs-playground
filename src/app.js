import { Observable, Subject } from 'rx';

import pick from 'lodash.pick';
import find from 'lodash.find';

import { run } from '@cycle/core';
import { makeDOMDriver, div } from '@cycle/dom';
import storageDriver from '@cycle/storage';

import constants from './constants';
import todoForm from './todoForm';
import todoList from './todoList';

import { serialize, deserialize } from './utils';

const STORAGE_KEY = '__todos';

function ammendState(DOM) {
  return function mapFn(state) {
    const formSinks = todoForm({ DOM });
    const listProps$ = Observable.just(pick(state, 'list'));
    const listSinks = todoList({
      DOM,
      props$: listProps$,
    });

    return {
      ...state,
      form: formSinks,
      list: listSinks,
    };
  };
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
        const { list } = data;
        const todo = find(list, item => item.id === id);

        todo.completed = !todo.completed;

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

  const ammendedState$ = state$
      .map(ammendState(DOM))
      .shareReplay(1);

  const formActions$ = ammendedState$
      .flatMapLatest(({ form }) => form.action$);

  const listActions$ = ammendedState$
      .flatMapLatest(({ list }) => list.action$);

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

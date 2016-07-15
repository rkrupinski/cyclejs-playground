import { Observable, Subject } from 'rx';

import intent from './intent';
import model from './model';
import view from './view';
import todoForm from '../todoForm';
import todoList from '../todoList';
import todoListToolbar from '../todoListToolbar';
import todoListPlaceholder from '../todoListPlaceholder';
import { serialize, deserialize } from '../utils';

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

function app({ DOM, storage }) {
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

export default app;
